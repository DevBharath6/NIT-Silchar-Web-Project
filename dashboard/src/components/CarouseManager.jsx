import React, { useState, useEffect } from "react";
import api from "../services/api";

const CarouselManager = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", link: "", image: null });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", link: "", image: null });
  const [alert, setAlert] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    try {
      const res = await api.get("/carousel");
      setItems(res.data);
    } catch {
      show("Failed to load items", "danger");
    }
  };

  const show = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 2500);
  };

  const handleUpload = async () => {
    if (!form.title || !form.image) return show("Image & Title required", "danger");

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v) fd.append(k, v);
    });

    try {
      const res = await api.post("/carousel", fd);
      setItems([res.data, ...items]);
      setForm({ title: "", description: "", link: "", image: null });
      document.getElementById("carouselImage").value = "";
      show("Added successfully");
    } catch {
      show("Upload failed", "danger");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/carousel/${deleteId}`);
      setItems(items.filter(i => i._id !== deleteId));
      setDeleteId(null);
      show("Deleted");
    } catch {
      show("Delete failed", "danger");
    }
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setEditForm({
      title: item.title,
      description: item.description,
      link: item.link,
      image: null
    });
  };

  const saveEdit = async (id) => {
    const fd = new FormData();
    Object.entries(editForm).forEach(([k, v]) => {
      if (v) fd.append(k, v);
    });

    try {
      const res = await api.put(`/carousel/${id}`, fd);
      setItems(items.map(i => (i._id === id ? res.data : i)));
      setEditId(null);
      setEditForm({ title: "", description: "", link: "", image: null });
      show("Updated");
    } catch {
      show("Update failed", "danger");
    }
  };

  return (
    <div className="container my-4">
      <h2>Manage Carousel</h2>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5>Add New Item</h5>
          {['title', 'description', 'link'].map((field) => (
            <div className="mb-2" key={field}>
              <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              {field === "description" ? (
                <textarea
                  className="form-control"
                  value={form[field]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                />
              ) : (
                <input
                  className="form-control"
                  value={form[field]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                />
              )}
            </div>
          ))}
          <div className="mb-3">
            <label className="form-label">Image</label>
            <input
              id="carouselImage"
              type="file"
              className="form-control"
              onChange={e => setForm({ ...form, image: e.target.files[0] })}
            />
          </div>
          <button className="btn btn-primary" onClick={handleUpload} disabled={!form.title || !form.image}>
            Upload
          </button>
        </div>
      </div>

      <div className="row">
        {items.length ? items.map((i) => (
          <div key={i._id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img src={i.imageUrl} className="card-img-top" style={{ height: 160, objectFit: "cover" }} alt="" />
              <div className="card-body">
                {editId === i._id ? (
                  <>
                    <input className="form-control mb-2" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                    <textarea className="form-control mb-2" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                    <input className="form-control mb-2" value={editForm.link} onChange={e => setEditForm({ ...editForm, link: e.target.value })} />
                    <input type="file" className="form-control" onChange={e => setEditForm({ ...editForm, image: e.target.files[0] })} />
                  </>
                ) : (
                  <>
                    <h5>{i.title}</h5>
                    <p>{i.description}</p>
                    {i.link && <a href={i.link} target="_blank" rel="noreferrer">{i.link}</a>}
                  </>
                )}
              </div>
              <div className="card-footer d-flex justify-content-between">
                {editId === i._id ? (
                  <button className="btn btn-success btn-sm" onClick={() => saveEdit(i._id)}>Save</button>
                ) : (
                  <button className="btn btn-outline-primary btn-sm" onClick={() => startEdit(i)}>Edit</button>
                )}
                <button className="btn btn-outline-danger btn-sm" onClick={() => setDeleteId(i._id)}>Delete</button>
              </div>
            </div>
          </div>
        )) : <p className="text-center text-muted">No items yet</p>}
      </div>

      {deleteId && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.4)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header"><h5>Confirm Delete</h5></div>
              <div className="modal-body">This action cannot be undone. Delete?</div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselManager;
