const express = require('express');
const router = express.Router();
const NavbarElement = require('../models/NavbarElement');

async function shiftOrders(newOrder, excludeId = null) {
  const query = { order: { $gte: newOrder } };
  if (excludeId) query._id = { $ne: excludeId };

  const itemsToShift = await NavbarElement.find(query).sort({ order: 1 });

  for (const item of itemsToShift) {
    item.order += 1;
    await item.save();
  }
}

function shiftChildOrders(parent, newOrder, excludeChildId = null) {
  parent.children.forEach((child) => {
    if (child.order >= newOrder && child._id.toString() !== excludeChildId) {
      child.order += 1;
    }
  });
}

router.get('/', async (req, res) => {
  try {
    const items = await NavbarElement.find().sort({ order: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, url, order, children = [] } = req.body;
    if (!order || order < 1) return res.status(400).json({ message: 'Order must be >= 1' });
    await shiftOrders(order);

    const newItem = new NavbarElement({ title, url, order, children });
    const saved = await newItem.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { order } = req.body;

    const item = await NavbarElement.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Navbar item not found' });

    if (order !== undefined && order >= 1 && order !== item.order) {
      await shiftOrders(order, req.params.id);
      item.order = order;
    }

    if (req.body.title !== undefined) item.title = req.body.title;
    if (req.body.url !== undefined) item.url = req.body.url;
    if (req.body.visible !== undefined) item.visible = req.body.visible;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const deleted = await NavbarElement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Navbar item not found' });

    res.json({ message: 'Navbar item deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/:id/children', async (req, res) => {
  try {
    const { title, url, order = 1, visible = true } = req.body;

    const parent = await NavbarElement.findById(req.params.id);
    if (!parent) return res.status(404).json({ message: 'Parent nav item not found' });

    if (order < 1) return res.status(400).json({ message: 'Child order must be >= 1' });

    shiftChildOrders(parent, order);

    parent.children.push({ title, url, order, visible });
    parent.children.sort((a, b) => a.order - b.order);

    await parent.save();
    res.status(201).json(parent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id/children/:childId', async (req, res) => {
  try {
    const parent = await NavbarElement.findById(req.params.id);
    if (!parent) return res.status(404).json({ message: 'Parent nav item not found' });

    const child = parent.children.id(req.params.childId);
    if (!child) return res.status(404).json({ message: 'Child nav item not found' });

    if (req.body.order !== undefined && req.body.order !== child.order) {
      if (req.body.order < 1) return res.status(400).json({ message: 'Child order must be >= 1' });

      shiftChildOrders(parent, req.body.order, req.params.childId);
      child.order = req.body.order;
    }

    if (req.body.title !== undefined) child.title = req.body.title;
    if (req.body.url !== undefined) child.url = req.body.url;
    if (req.body.visible !== undefined) child.visible = req.body.visible;

    parent.children.sort((a, b) => a.order - b.order);
    await parent.save();
    res.json(parent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id/children/:childId', async (req, res) => {
  try {
    const parent = await NavbarElement.findById(req.params.id);
    if (!parent) return res.status(404).json({ message: 'Parent nav item not found' });

    const child = parent.children.id(req.params.childId);
    if (!child) return res.status(404).json({ message: 'Child nav item not found' });

    parent.children.pull(req.params.childId);
    await parent.save();
    res.json(parent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
