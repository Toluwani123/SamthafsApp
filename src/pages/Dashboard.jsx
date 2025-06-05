// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {api} from '../api';
import { FaPencilAlt, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  // --- TABS ---
  const tabs = ['homepage', 'projects', 'team'];
  const [activeTab, setActiveTab] = useState('homepage');

  // --- STATE: HOMEPAGE SETTINGS ---
  const [homeData, setHomeData] = useState(null);
  const [homeImageFile, setHomeImageFile] = useState(null);

  // rename “homeText” → “mainText”, and add “subText”
  const [mainText, setMainText] = useState('');
  const [subText, setSubText]   = useState('');

  const [homeLoading, setHomeLoading] = useState(false);
  const [homeError, setHomeError] = useState('');

  // --- STATE: PROJECTS ---
  const [projects, setProjects] = useState([]);
  const [projLoading, setProjLoading] = useState(false);
  const [projError, setProjError] = useState('');
  // For Create / Edit
  const emptyProj = {
    title: '',
    category: 'commercial',
    overview: '',
    project_size: '',
    start_date: '',
    completion_date: '',
    location: '',
    budget: '',
    client_name: '',
    client_testimonial: '',
    main_image: null,
    // We’ll skip nested phases/gallery/challenges in this basic skeleton
  };
  const [editingProj, setEditingProj] = useState(null);
  const [projForm, setProjForm] = useState({ ...emptyProj });
  const [phasesList, setPhasesList] = useState([
    { title: '', description: '', order:0},
  ]);
  const [galleryList, setGalleryList] = useState([
    { image: null, existingImage: null },
  ]);
  const [challengesList, setChallengesList] = useState([
    { title: '', description: '', solution:""},   
 ]);

  // --- STATE: TEAM MEMBERS ---
  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState('');
  const emptyMember = { full_name: '', role: '', description: '', image: null };
  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState({ ...emptyMember });

  // ----------------------------------------
  // 1. FETCH HOMEPAGE DATA
  // ----------------------------------------
  useEffect(() => {
    async function fetchHome() {
      setHomeLoading(true);
      try {
        const { data } = await api.get('/home/'); // GET homepage/
        setHomeData(data);
        setMainText(data.main_text || '');
        setSubText(data.sub_text   || '');
      } catch (err) {
        console.error(err);
        setHomeError('Failed to load homepage settings.');
      } finally {
        setHomeLoading(false);
      }
    }
    fetchHome();
  }, []);

  // ----------------------------------------
  // 2. FETCH PROJECTS LIST
  // ----------------------------------------
  useEffect(() => {
    async function fetchProjects() {
      setProjLoading(true);
      try {
        const { data } = await api.get('/projects/'); // GET /projects/
        setProjects(data);
      } catch (err) {
        console.error(err);
        setProjError('Failed to load projects.');
      } finally {
        setProjLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // ----------------------------------------
  // 3. FETCH TEAM MEMBERS
  // ----------------------------------------
  useEffect(() => {
    async function fetchTeam() {
      setTeamLoading(true);
      try {
        const { data } = await api.get('/team/'); // GET /team/
        setTeam(data);
      } catch (err) {
        console.error(err);
        setTeamError('Failed to load team members.');
      } finally {
        setTeamLoading(false);
      }
    }
    fetchTeam();
  }, []);

  // ----------------------------------------
  // HANDLERS: HOMEPAGE FORM
  // ----------------------------------------
  const handleHomeImageChange = e => {
    setHomeImageFile(e.target.files[0]);
  };

  const handleMainTextChange = e => {
    setMainText(e.target.value);
  };
  // new handler for sub_text
  const handleSubTextChange = e => {
    setSubText(e.target.value);
  };

    const submitHomeUpdate = async e => {
        e.preventDefault();
        setHomeLoading(true);
        setHomeError('');
        try {
        const formData = new FormData();

        // send main_text + sub_text
        formData.append('main_text', mainText);
        formData.append('sub_text',  subText);

        // replace hero_image → background_image
        if (homeImageFile) {
            formData.append('background_image', homeImageFile);
        }

        // PATCH to /homepage/
        await api.patch('/home/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Refresh after saving
        const { data } = await api.get('/home/');
        setHomeData(data);
        setHomeImageFile(null);
        } catch (err) {
        console.error(err);
        setHomeError('Failed to update homepage.');
        } finally {
        setHomeLoading(false);
        }
  };


  // ----------------------------------------
  // HANDLERS: PROJECT FORM (CREATE / EDIT)
  // ----------------------------------------
  const startEditProject = proj => {
    setEditingProj(proj.id);
    setProjForm({
      title: proj.title,
      category: proj.category,
      overview: proj.overview,
      project_size: proj.project_size,
      start_date: proj.start_date,
      completion_date: proj.completion_date,
      location: proj.location,
      budget: proj.budget,
      client_name: proj.client_name,
      client_testimonial: proj.client_testimonial,
      main_image: null, // new file if user uploads
    });
    setPhasesList(
        proj.phases.map((p) => ({
            title: p.title,
            description: p.description,
            order: p.order,
        }))
    );
    setGalleryList(
        proj.gallery.map((g) => ({
            image: null, // reset to allow new upload
            existingImage: g.image, // keep existing image URL
        }))
    );
    setChallengesList(
        proj.challenges.map((c) => ({
            title: c.title,
            description: c.description,
            solution: c.solution,
        }))
    );
  };

  const handleProjInputChange = e => {
    const { name, value } = e.target;
    setProjForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProjImageChange = e => {
    setProjForm(prev => ({ ...prev, main_image: e.target.files[0] }));
  };

  const cancelProjEdit = () => {
    setEditingProj(null);
    setProjForm({ ...emptyProj });
    setPhasesList([{ title: '', description: '', order: 0 }]);
    setGalleryList([{ image: null, order: 0 }]);
    setChallengesList([{ title: '', description: '', solution: '' }]);
  };

  // … inside Dashboard.jsx …

    // inside Dashboard.jsx, replace your existing submitProjForm with:

    const submitProjForm = async (e) => {
        e.preventDefault();
        setProjError('');

        try {
            // 1) Build a new FormData
            const formData = new FormData();

            // 2) Append all top‐level (simple) fields:
            Object.entries(projForm).forEach(([key, val]) => {
            if (val !== null && val !== '') {
                formData.append(key, val);
            }
            });

            // 3) Always send phases & challenges as plain JSON strings:
            //    e.g. phasesList = [ { title: 'Demolition', … }, { … } ]
            console.log('Phases before stringify:', phasesList);
            formData.append('phases', JSON.stringify(phasesList));

            console.log('Challenges before stringify:', challengesList);
            formData.append('challenges', JSON.stringify(challengesList));

            // 4) Build a gallery‐payload that only contains “order” keys,
            //    because DRF’s update() will delete/create on that basis.
            const galleryPayload = galleryList.map(_ => ({
                
            // do NOT include `image` here—files come next under gallery[i][image]
            }));
            console.log('Gallery payload before stringify:', galleryPayload);
            formData.append('gallery', JSON.stringify(galleryPayload));

            // 5) Now append each image file under exactly `gallery[<idx>][image]`
            galleryList.forEach((g, idx) => {
                if (g.image instanceof File) {
                    // THIS must match what your view’s parsing logic expects.
                    formData.append(`gallery[${idx}][image]`, g.image);
                }
            });

            // 6) (Debug) log all keys being sent, to confirm no “double nesting”
            const sentKeys = [];
            for (let pair of formData.entries()) {
            sentKeys.push(pair[0]);
            }
            console.log('FormData keys being sent:', sentKeys);
            if (projForm.main_image instanceof File) {
                formData.append('main_image', projForm.main_image);
            }

            // 7) Decide whether to POST (create) or PUT (update)
            const endpoint = editingProj
            ? `/projects/${editingProj}/`
            : '/projects/';
            const method = editingProj ? 'put' : 'post';

            // 8) Fire the request
            const response = await api[method](endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('API Response:', response.data);

            // 9) Refresh the list and clear out the form
            const { data } = await api.get('/projects/');
            setProjects(data);
            cancelProjEdit();
        } catch (err) {
            console.error('Error payload returned by DRF:', err.response?.data || err);
            setProjError('Failed to save project. See console for details.');
        }
    };




  const deleteProject = async id => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}/`);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      setProjError('Could not delete project.');
    }
  };
  const addPhase = () => {
    setPhasesList(prev => [
      ...prev,
      { title: '', description: '', order: prev.length },
    ]);
  };
  const updatePhase = (idx, field, value) => {
    setPhasesList(prev =>
      prev.map((p, i) =>
        i === idx ? { ...p, [field]: value } : p
      )
    );
  };
  const removePhase = idx => {
    setPhasesList(prev => prev.filter((_, i) => i !== idx));
  };

  // ───── GALLERY HANDLERS ─────
  const addGalleryImage = () => {
    setGalleryList(prev => [
      ...prev,
      { image: null, order: prev.length },
    ]);
  };
  const updateGalleryImage = (idx, file) => {
    setGalleryList(prev =>
      prev.map((g, i) => (i === idx ? { ...g, image: file } : g))
    );
  };
  const updateGalleryOrder = (idx, value) => {
    setGalleryList(prev =>
      prev.map((g, i) => (i === idx ? { ...g, order: value } : g))
    );
  };
  const removeGalleryImage = idx => {
    setGalleryList(prev => prev.filter((_, i) => i !== idx));
  };

  // ───── CHALLENGES HANDLERS ─────
  const addChallenge = () => {
    setChallengesList(prev => [
      ...prev,
      { title: '', description: '', solution: '' },
    ]);
  };
  const updateChallenge = (idx, field, value) => {
    setChallengesList(prev =>
      prev.map((c, i) =>
        i === idx ? { ...c, [field]: value } : c
      )
    );
  };
  const removeChallenge = idx => {
    setChallengesList(prev => prev.filter((_, i) => i !== idx));
  };

  // ----------------------------------------
  // HANDLERS: TEAM MEMBER FORM (CREATE / EDIT)
  // ----------------------------------------
  const startEditMember = mem => {
    setEditingMember(mem.id);
    setMemberForm({
      full_name: mem.full_name,
      role: mem.role,
      description: mem.description,
      image: null,
    });
  };

  const handleMemberInputChange = e => {
    const { name, value } = e.target;
    setMemberForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberImageChange = e => {
    setMemberForm(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const cancelMemberEdit = () => {
    setEditingMember(null);
    setMemberForm({ ...emptyMember });
  };

  const submitMemberForm = async e => {
    e.preventDefault();
    setTeamError('');
    try {
      const formData = new FormData();
      Object.entries(memberForm).forEach(([key, val]) => {
        if (val !== null && val !== '') {
          formData.append(key, val);
        }
      });

      if (editingMember) {
        await api.put(`/team/${editingMember}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/team/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      // Refresh team list:
      const { data } = await api.get('/team/');
      setTeam(data);
      cancelMemberEdit();
    } catch (err) {
      console.error(err);
      setTeamError('Failed to save team member.');
    }
  };

  const deleteMember = async id => {
    if (!window.confirm('Remove this team member?')) return;
    try {
      await api.delete(`/team/${id}/`);
      setTeam(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      setTeamError('Could not delete member.');
    }
  };

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* TAB NAV */}
      <div className="bg-white shadow">
        <nav className="container mx-auto px-6 flex space-x-4 items-center">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 font-medium ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <Link
            to="/"
            className="ml-auto py-4 px-6 font-medium text-blue-600 hover:text-blue-800"
          >
            Back to Home
          </Link>
        </nav>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* ============ HOMEPAGE ============ */}
        {activeTab === 'homepage' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Edit Homepage</h2>

            {homeError && (
              <div className="mb-4 text-red-600">{homeError}</div>
            )}

            {homeLoading && (
              <div className="mb-4 text-gray-500">Loading…</div>
            )}

            {homeData && (
                <form onSubmit={submitHomeUpdate} className="bg-white p-6 rounded-lg shadow">
                    {/* → Main Text */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                        Main Text
                        </label>
                        <textarea
                        className="w-full border border-gray-300 p-2 rounded"
                        value={mainText}
                        onChange={handleMainTextChange}
                        rows={2}
                        />
                    </div>

                    {/* → Sub Text */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                        Sub Text
                        </label>
                        <textarea
                        className="w-full border border-gray-300 p-2 rounded"
                        value={subText}
                        onChange={handleSubTextChange}
                        rows={1}
                        />
                    </div>

                    {/* → Background Image */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                        Background Image
                        </label>
                        {homeData.background_image && (
                        <img
                            src={homeData.background_image}
                            alt="Current background"
                            className="w-64 h-32 object-cover rounded mb-2"
                        />
                        )}
                        <input
                        type="file"
                        accept="image/*"
                        onChange={handleHomeImageChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="!rounded-button bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
                    >
                        Save Changes
                    </button>
                </form>

            )}
          </div>
        )}

        {/* ============ PROJECTS ============ */}
        {activeTab === 'projects' && (
            <div>
                <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Projects</h2>
                <button
                    onClick={() => {
                    setEditingProj(null);
                    setProjForm({ ...emptyProj });
                    // reset nested lists if you wish:
                    setPhasesList([{ title: '', description: '', order: 0 }]);
                    setGalleryList([{ image: null, order: 0 }]);
                    setChallengesList([{ title: '', description: '', solution: '' }]);
                    }}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    <FaPlus /> <span>New Project</span>
                </button>
                </div>

                {/* PROJECT FORM */}
                {(editingProj !== null || editingProj === null) && (
                <form
                    onSubmit={submitProjForm}
                    className="bg-white p-6 rounded-lg shadow mb-8"
                >
                    {/* ─── Basic Fields: title, category, etc. ─── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                        Title
                        </label>
                        <input
                        type="text"
                        name="title"
                        required
                        value={projForm.title}
                        onChange={handleProjInputChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                        Category
                        </label>
                        <select
                        name="category"
                        value={projForm.category}
                        onChange={handleProjInputChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        >
                        <option value="commercial">Commercial</option>
                        <option value="residential">Residential</option>
                        <option value="industrial">Industrial</option>
                        <option value="interior">Interior</option>
                        <option value="exterior">Exterior</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                        Location
                        </label>
                        <input
                        type="text"
                        name="location"
                        required
                        value={projForm.location}
                        onChange={handleProjInputChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                        Budget
                        </label>
                        <input
                        type="number"
                        name="budget"
                        required
                        value={projForm.budget}
                        onChange={handleProjInputChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                        Start Date
                        </label>
                        <input
                        type="date"
                        name="start_date"
                        required
                        value={projForm.start_date}
                        onChange={handleProjInputChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                        Completion Date
                        </label>
                        <input
                        type="date"
                        name="completion_date"
                        required
                        value={projForm.completion_date}
                        onChange={handleProjInputChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        />
                    </div>
                    </div>

                    <div className="mt-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Overview
                    </label>
                    <textarea
                        name="overview"
                        required
                        value={projForm.overview}
                        onChange={handleProjInputChange}
                        rows={3}
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    </div>

                    <div className="mt-4 flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-2">
                        Project Size
                        </label>
                        <input
                        type="text"
                        name="project_size"
                        required
                        value={projForm.project_size}
                        onChange={handleProjInputChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-2">
                        Client Name
                        </label>
                        <input
                        type="text"
                        name="client_name"
                        required
                        value={projForm.client_name}
                        onChange={handleProjInputChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        />
                    </div>
                    </div>

                    <div className="mt-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Client Testimonial
                    </label>
                    <textarea
                        name="client_testimonial"
                        value={projForm.client_testimonial}
                        onChange={handleProjInputChange}
                        rows={2}
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    </div>

                    {/* ─── Main Image ─── */}
                    <div className="mt-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Main Image
                    </label>
                    {editingProj && (
                        <div className="mb-2">
                        <img
                            src={projects.find(p => p.id === editingProj)?.main_image}
                            alt="Current"
                            className="w-32 h-20 object-cover rounded"
                        />
                        </div>
                    )}
                    <input
                        type="file"
                        name="main_image"
                        accept="image/*"
                        onChange={handleProjImageChange}
                    />
                    </div>

                    {/* ─── NESTED: PHASES ─── */}
                    <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Phases</h3>
                    {phasesList.map((ph, idx) => (
                        <div key={idx} className="mb-4 border border-gray-200 p-4 rounded">
                        <div className="flex justify-between">
                            <span className="font-medium">Phase #{idx + 1}</span>
                            <button
                            type="button"
                            onClick={() => removePhase(idx)}
                            className="text-red-600 hover:text-red-800"
                            >
                            <FaTimes />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            <div>
                            <label className="block text-gray-700 text-sm">Title</label>
                            <input
                                type="text"
                                value={ph.title}
                                onChange={e =>
                                updatePhase(idx, 'title', e.target.value)
                                }
                                className="w-full border border-gray-300 p-1 rounded"
                            />
                            </div>
                            <div>
                            <label className="block text-gray-700 text-sm">Order</label>
                            <input
                                type="number"
                                value={ph.order}
                                onChange={e =>
                                updatePhase(idx, 'order', e.target.value)
                                }
                                className="w-full border border-gray-300 p-1 rounded"
                            />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label className="block text-gray-700 text-sm">
                            Description
                            </label>
                            <textarea
                            value={ph.description}
                            onChange={e =>
                                updatePhase(idx, 'description', e.target.value)
                            }
                            rows={2}
                            className="w-full border border-gray-300 p-1 rounded"
                            />
                        </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addPhase}
                        className="flex items-center space-x-2 text-green-600 hover:text-green-800"
                    >
                        <FaPlus /> <span>Add Phase</span>
                    </button>
                    </div>

                    {/* ─── NESTED: GALLERY ─── */}
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-2">Gallery Images</h3>

                      {galleryList.map((g, idx) => (
                        <div key={idx} className="mb-4 border border-gray-200 p-4 rounded">
                          <div className="flex justify-between">
                            <span className="font-medium">Image #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTimes />
                            </button>
                          </div>

                          {/*  Show existing preview if we have one  */}
                          {g.existingImage && (
                            <div className="mb-2">
                              <img
                                src={g.existingImage}
                                alt={`Existing gallery ${idx + 1}`}
                                className="w-32 h-20 object-cover rounded"
                              />
                            </div>
                          )}

                          <div className="mt-2">
                            <label className="block text-gray-700 text-sm">File</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => updateGalleryImage(idx, e.target.files[0])}
                              className="w-full"
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addGalleryImage}
                        className="flex items-center space-x-2 text-green-600 hover:text-green-800"
                      >
                        <FaPlus /> <span>Add Image</span>
                      </button>
                    </div>



                    {/* ─── NESTED: CHALLENGES ─── */}
                    <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Challenges</h3>
                    {challengesList.map((ch, idx) => (
                        <div key={idx} className="mb-4 border border-gray-200 p-4 rounded">
                        <div className="flex justify-between">
                            <span className="font-medium">Challenge #{idx + 1}</span>
                            <button
                            type="button"
                            onClick={() => removeChallenge(idx)}
                            className="text-red-600 hover:text-red-800"
                            >
                            <FaTimes />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                            <div>
                            <label className="block text-gray-700 text-sm">Title</label>
                            <input
                                type="text"
                                value={ch.title}
                                onChange={e =>
                                updateChallenge(idx, 'title', e.target.value)
                                }
                                className="w-full border border-gray-300 p-1 rounded"
                            />
                            </div>
                            <div>
                            <label className="block text-gray-700 text-sm">Description</label>
                            <textarea
                                value={ch.description}
                                onChange={e =>
                                updateChallenge(idx, 'description', e.target.value)
                                }
                                rows={2}
                                className="w-full border border-gray-300 p-1 rounded"
                            />
                            </div>
                            <div>
                            <label className="block text-gray-700 text-sm">Solution</label>
                            <textarea
                                value={ch.solution}
                                onChange={e =>
                                updateChallenge(idx, 'solution', e.target.value)
                                }
                                rows={2}
                                className="w-full border border-gray-300 p-1 rounded"
                            />
                            </div>
                        </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addChallenge}
                        className="flex items-center space-x-2 text-green-600 hover:text-green-800"
                    >
                        <FaPlus /> <span>Add Challenge</span>
                    </button>
                    </div>

                    {projError && (
                    <div className="mt-4 text-red-600">{projError}</div>
                    )}

                    <div className="mt-6 flex space-x-4">
                    <button
                        type="submit"
                        className="!rounded-button bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
                    >
                        {editingProj ? 'Update Project' : 'Create Project'}
                    </button>
                    {editingProj && (
                        <button
                        type="button"
                        onClick={cancelProjEdit}
                        className="!rounded-button bg-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-400 transition"
                        >
                        <FaTimes /> Cancel
                        </button>
                    )}
                    </div>
                </form>
                )}

                {/* PROJECT LIST */}
                <div className="space-y-4">
                {projLoading && <div>Loading projects…</div>}
                {projects.map(p => (
                    <div
                    key={p.id}
                    className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                    >
                    <div>
                        <h3 className="font-semibold text-lg">{p.title}</h3>
                        <p className="text-gray-600 text-sm">{p.category}</p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                        onClick={() => startEditProject(p)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                        >
                        <FaPencilAlt />
                        </button>
                        <button
                        onClick={() => deleteProject(p.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                        >
                        <FaTrash />
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        )}

        {/* ============ TEAM MEMBERS ============ */}
        {activeTab === 'team' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Team Members</h2>
              <button
                onClick={() => {
                  setEditingMember(null);
                  setMemberForm({ ...emptyMember });
                }}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                <FaPlus /> <span>New Member</span>
              </button>
            </div>

            {/* MEMBER FORM */}
            {(editingMember !== null || editingMember === null) && (
              <form
                onSubmit={submitMemberForm}
                className="bg-white p-6 rounded-lg shadow mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={memberForm.full_name}
                      onChange={handleMemberInputChange}
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      name="role"
                      required
                      value={memberForm.role}
                      onChange={handleMemberInputChange}
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    value={memberForm.description}
                    onChange={handleMemberInputChange}
                    rows={3}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Profile Image
                  </label>
                  {editingMember && (
                    <div className="mb-2">
                      <img
                        src={team.find(m => m.id === editingMember)?.image}
                        alt="Current"
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleMemberImageChange}
                  />
                </div>

                {teamError && (
                  <div className="mt-4 text-red-600">{teamError}</div>
                )}

                <div className="mt-6 flex space-x-4">
                  <button
                    type="submit"
                    className="!rounded-button bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
                  >
                    {editingMember ? 'Update Member' : 'Add Member'}
                  </button>
                  {editingMember && (
                    <button
                      type="button"
                      onClick={cancelMemberEdit}
                      className="!rounded-button bg-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-400 transition"
                    >
                      <FaTimes /> Cancel
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* TEAM LIST */}
            <div className="space-y-4">
              {teamLoading && <div>Loading team…</div>}
              {team.map(m => (
                <div
                  key={m.id}
                  className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={m.image}
                      alt={m.full_name}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{m.full_name}</h3>
                      <p className="text-gray-600 text-sm">{m.role}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditMember(m)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => deleteMember(m.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
