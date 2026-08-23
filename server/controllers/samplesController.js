const updateSample = async (req, res) => {
  try {
    const sample = await Sample.findById(req.params.id);
    if (!sample) {
      return res.status(404).json({ message: 'Sample not found' });
    }

    const { currentLabel, status, labeledBy, clientUpdatedAt } = req.body;

    if (clientUpdatedAt) {
      const currentUpdatedAt = new Date(sample.updatedAt).getTime();
      const clientKnownUpdatedAt = new Date(clientUpdatedAt).getTime();
      if (currentUpdatedAt > clientKnownUpdatedAt) {
        return res.status(409).json({
          message: 'This sample was modified by someone else since you last loaded it.',
          currentSample: sample,
        });
      }
    }

    if (currentLabel !== undefined) sample.currentLabel = currentLabel;
    if (status !== undefined) sample.status = status;
    if (labeledBy !== undefined) sample.labeledBy = labeledBy;

    if (currentLabel !== undefined) {
      sample.history.push({
        action: 'labeled',
        label: currentLabel,
        by: labeledBy || sample.labeledBy || 'unknown',
        at: new Date().toISOString(),
      });
    }

    await sample.save();

    // Notify every connected client that this sample changed
    const io = req.app.get('io');
    if (io) {
      io.emit('sampleUpdated', sample);
    }

    res.status(200).json(sample);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid sample id.' });
    }
    res.status(404).json({ message: 'Sample not found' });
  }
};