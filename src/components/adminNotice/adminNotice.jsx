import AdminNavBar from '../adminNavBar/AdminNavBar'
import './adminNotice.css'
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Notice = () => {

    const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [heading, setHeading] = useState('')
    const [title, setTitle] = useState('')
    const [list, setList] = useState([])
    const [editList, setEditList] = useState([])
    console.log(editList)



    const navigate = useNavigate()
    const handleHeading = (event) => {
        setHeading(event.target.value)
    }
    const handleTitle = (event) => {
        setTitle(event.target.value)
    }



    const openEditProfileModal = (i) => {
        console.log("id is :", i);
        setEditList(list[i])
        console.log(editList)

        setEditProfileModalOpen(true);
    };
    const closeEditProfileModal = () => {
        setEditProfileModalOpen(false);
    };


    const openaddModalOpen = () => {
        setAddModalOpen(true);
    };
    const closeAddModal = () => {
        setAddModalOpen(false);
    };


    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            if (!title.trim()) {
                toast.error('Title is required.');
                return;
            }

            if (!heading) {
                toast.error('Heading is required.');
                return;
            }




            const formData = new FormData();
            formData.append('title', heading);
            formData.append('sub_title', title);

            const response = await axios.post('https://carousal-backend.onrender.com/titlesubtitlemodels/', formData);

            if (response) {
                closeAddModal()
                navigate('/notice')
                console.log(response.data);

            }
        } catch (error) {
            console.error('Error posting video and title:', error);
        }

    }

    useEffect(() => {

        const getList = () => {
            axios.get('https://carousal-backend.onrender.com/titlesubtitlemodels/').then(response => {
                setList(response.data)
            }).catch(error => {
                console.error('error fetching data :', error)
            })
        }
        getList()
    }, [])


    const handleDelete = async (id) => {
        try {

            const confirmDelete = window.confirm('Are you sure you want to delete this item?');

            if (confirmDelete) {
                await axios.delete(`https://carousal-backend.onrender.com/titlesubtitlemodels/${id}/`);
                const response = await axios.get('https://carousal-backend.onrender.com/titlesubtitlemodels/');
                setList(response.data);
            }
        } catch (error) {
            console.error('Error deleting video:', error);
        }
    };


    const editListHandle = async (event) => {
        try {
            event.preventDefault();

            if (!editList.title.trim() || !editList.sub_title.trim()) {
                toast.error('Both title and subtitle are required.');
                return;
            }

            const formData = new FormData();
            formData.append('title', editList.title);
            formData.append('sub_title', editList.sub_title);

            const response = await axios.put(`https://carousal-backend.onrender.com/titlesubtitlemodels/${editList.id}/`, formData);

            if (response) {
                closeEditProfileModal();
                const updatedList = list.map(item => item.id === editList.id ? editList : item);
                setList(updatedList);
                toast.success('Notice updated successfully.');
            }
        } catch (error) {
            console.error('Error updating notice:', error);
        }
    };

    const handleEditTitleChange = (event) => {
        setEditList({ ...editList, title: event.target.value });
    };

    const handleEditSubtitleChange = (event) => {
        setEditList({ ...editList, sub_title: event.target.value });
    };





    return (
        <>

            <AdminNavBar />

            <div className="">



                <div className="flex items-center justify-center mt-20">
                    <div className="overflow-x-auto h-3/5 w-3/5 max-lg:w-ful p-5 max-lg:px-4 rounded-md border-2 shadow-md bg-white">
                        <div className="flex justify-center max-sm:grid items-center">
                            <div className='flex justify-center'>
                                <h1 className="mb-5 text-3xl font-bold max-lg:text-xl">
                                    Notice
                                </h1>
                            </div>
                        </div>

                        <div className='flex justify-end '>

                            <button onClick={openaddModalOpen} className='bg-green-600 p-2 rounded-md w-[80px] font-semibold'>
                                Add
                            </button>
                        </div>

                        <table className="min-w-full bg-white border border-gray-300 mt-3">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-2 justify-center">sl.no</th>

                                    <th className="border border-gray-300 p-2 justify-center">Heading</th>
                                    <th className="border border-gray-300 p-2 justify-center">Title</th>

                                    <th className="border border-gray-300 p-2 flex items-center justify-center">
                                        Action
                                    </th>

                                </tr>
                            </thead>
                            <tbody>

                                {list.map((list, index) => (



                                    <tr key={index} className="border-b border-gray-300">
                                        <td className="border-r border-gray-300 p-3 font-medium">{index + 1}</td>

                                        <td className="border-r border-gray-300 p-3 ">{list.title}</td>
                                        <td className="border-r border-gray-300 p-3 ">{list.sub_title}</td>

                                        <td >

                                            <div className='flex justify-center gap-6'>
                                                <div onClick={() => handleDelete(list.id)}>
                                                    <MdDelete style={{ color: 'red', cursor: 'pointer' }} size={30} onMouseEnter={(e) => e.target.style.color = 'darkred'} onMouseLeave={(e) => e.target.style.color = 'red'} />
                                                </div>
                                                <div onClick={() => openEditProfileModal(index)}>
                                                    <FaRegEdit style={{ color: 'blue', cursor: 'pointer' }} size={27} onMouseEnter={(e) => e.target.style.color = 'darkblue'} onMouseLeave={(e) => e.target.style.color = 'blue'} />
                                                </div>
                                            </div>



                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal isOpen={isEditProfileModalOpen} onRequestClose={closeEditProfileModal} style={{ overlay: { zIndex: 1000 }, content: { width: '30%', height: '60%', margin: 'auto', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', border: 'none' } }}>
                <button onClick={closeEditProfileModal}><IoClose /></button>
                <div>
                    <div className='flex justify-center'>
                        <p className="title">Edit Notice</p>
                    </div>
                    <div className='mt-8 flex justify-center items-center'>

                        <form onSubmit={editListHandle} className='flex flex-col w-[100%]'>
                            <div className="input-field">
                                <input value={editList.title} onChange={handleEditTitleChange} className="input" type="text" />
                                <label className="label" htmlFor="emailInput">Enter Heading</label>
                            </div>
                            <div className="input-field">
                                <input value={editList.sub_title} onChange={handleEditSubtitleChange} className="input" type="text" />
                                <label className="label" htmlFor="emailInput">Enter Title</label>
                            </div>
                            <button className="submit-btn">Update</button>
                        </form>
                    </div>

                </div>

            </Modal>



            <Modal isOpen={addModalOpen} onRequestClose={closeAddModal} style={{ overlay: { zIndex: 1000 }, content: { width: '30%', height: '60%', margin: 'auto', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', border: 'none' } }}>
                <button onClick={closeAddModal}><IoClose /></button>
                <div>
                    <div className='flex justify-center'>
                        <p className="title">Add Notice</p>
                    </div>
                    <div className='mt-8 flex justify-center items-center'>

                        <form onSubmit={handleSubmit} className='flex flex-col w-[100%]'>
                            <div className="input-field">
                                <input onChange={handleHeading} value={heading} className="input" type="text" />
                                <label className="label" htmlFor="emailInput">Enter Heading</label>
                            </div>
                            <div className="input-field">
                                <input onChange={handleTitle} value={title} className="input" type="text" />
                                <label className="label" htmlFor="emailInput">Enter Title</label>
                            </div>
                            <button className="submit-btn">Submit</button>
                        </form>
                    </div>

                </div>

            </Modal>
        </>
    )
}

export default Notice
