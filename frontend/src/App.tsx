import { useEffect, useRef, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import ContactList from './components/ContactList';
import { getContacts, saveContact, udpatePhoto } from './controller/ContactService';
import { Routes, Route, Navigate,  } from 'react-router-dom';
import ContactDetail from './components/ContactDetail';
import { toastError } from './controller/ToastService';
import { ToastContainer } from 'react-toastify';


export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  status: string;
  photoUrl: string; 
}

export interface Data {
  content: Contact[];
  totalPages: number;
  totalElements: number;
}

const App = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<Data>({ content: [], totalPages: 0, totalElements: 0 });
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [values, setValues] = useState<Contact>({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    status: '',
    photoUrl: '', 
  });

  const getAllContacts = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);
      const response = await getContacts(page, size);
      setData(response.data);
      console.log(response.data);
    } catch (error: any) {
      console.error(error);
      toastError(error.message);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues(prevValues => ({ ...prevValues, [name]: value }));
  };

  const handleNewContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await saveContact(values);
      if (file) {
        await uploadPhoto(file, response.data.id);
      }
      resetForm();
      getAllContacts();
    } catch (error: any) {
      console.error(error);
      toastError(error.message);
    }
  };

  const uploadPhoto = async (file: File, id: string) => {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id', id);
    await udpatePhoto(formData);
  };

  const resetForm = () => {
    toggleModal(false);
    setFile(undefined);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
    setValues({
      id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      title: '',
      status: '',
      photoUrl: '', 
    });
  };

  const updateContact = async (contact: Contact) => {
    try {
      await saveContact(contact);
    } catch (error: any) {
      console.error(error);
      toastError(error.message);
    }
  };

  const toggleModal = (show: boolean) => {
    if (show) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <>
      <Header toggleModal={toggleModal} nbOfContacts={data.totalElements} />
      <main className='main'>
        <div className='container'>
          <Routes>
            <Route path='/' element={<Navigate to={'/contacts'} />} />
            <Route path="/contacts" element={<ContactList data={data} currentPage={currentPage} getAllContacts={getAllContacts} />} />
            <Route path="/contacts/:id" element={<ContactDetail updateContact={updateContact} updateImage={uploadPhoto} />} />
          </Routes>
        </div>
      </main>

      {/* Modal */}
      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Contact</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewContact}>
            <div className="user-details">
              {['name', 'email', 'title', 'phone', 'address', 'status'].map((field) => (
                <div className="input-box" key={field}>
                  <span className="details">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                  <input 
                    type="text" 
                    value={values[field as keyof Contact]} 
                    onChange={onChange} 
                    name={field} 
                    required 
                  />
                </div>
              ))}
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input 
                  type="file" 
                  onChange={(event) => setFile(event.target.files ? event.target.files[0] : undefined)} 
                  ref={fileRef} 
                  name='photo' 
                  required 
                />
              </div>
            </div>
            <div className="form_footer">
              <button onClick={() => toggleModal(false)} type='button' className="btn btn-danger">Cancel</button>
              <button type='submit' className="btn">Save</button>
            </div>
          </form>
        </div>
      </dialog>
      <ToastContainer />
    </>
  );
}

export default App;
