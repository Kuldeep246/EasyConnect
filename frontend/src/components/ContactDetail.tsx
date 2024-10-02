import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getContact } from '../controller/ContactService';
import { toastError, toastSuccess } from '../controller/ToastService';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  status: string;
  photoUrl: string;
}

interface ContactDetailProps {
  updateContact: (contact: Contact) => Promise<void>;
  updateImage: (formData: FormData) => Promise<void>;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ updateContact, updateImage }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [contact, setContact] = useState<Contact>({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    status: '',
    photoUrl: ''
  });

  const { id } = useParams<{ id: string }>();

  const fetchContact = async (id: string) => {
    try {
      const { data } = await getContact(id);
      setContact(data);
      console.log(data);
      // toastSuccess('Contact retrieved');
    } catch (error: any) {
      console.log(error);
      toastError(error.message);
    }
  };

  const selectImage = () => {
    inputRef.current?.click();
  };

  const updatePhoto = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id', id!);
      await updateImage(formData);
      setContact((prev) => ({
        ...prev,
        photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}`
      }));
      toastSuccess('Photo updated');
    } catch (error: any) {
      console.log(error);
      toastError(error.message);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContact({ ...contact, [event.target.name]: event.target.value });
  };

  const onUpdateContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateContact(contact);
    fetchContact(id!);
    toastSuccess('Contact Updated');
  };

  useEffect(() => {
    if (id) {
      fetchContact(id);
    }
  }, [id]);

  return (
    <>
      <Link to={'/contacts'} className='link'>
        <i className='bi bi-arrow-left'></i> Back to list
      </Link>
      <div className='profile'>
        <div className='profile__details'>
          <img src={contact.photoUrl} alt={`Profile photo of ${contact.name}`} />
          <div className='profile__metadata'>
            <p className='profile__name'>{contact.name}</p>
            <p className='profile__muted'>JPG, GIF, or PNG. Max size of 10MB</p>
            <button onClick={selectImage} className='btn'>
              <i className='bi bi-cloud-upload'></i> Change Photo
            </button>
          </div>
        </div>
        <div className='profile__settings'>
          <div>
            <form onSubmit={onUpdateContact} className="form">
              <div className="user-details">
                <input type="hidden" defaultValue={contact.id} name="id" required />
                <div className="input-box">
                  <span className="details">Name</span>
                  <input type="text" value={contact.name} onChange={onChange} name="name" required />
                </div>
                <div className="input-box">
                  <span className="details">Email</span>
                  <input type="text" value={contact.email} onChange={onChange} name="email" required />
                </div>
                <div className="input-box">
                  <span className="details">Phone</span>
                  <input type="text" value={contact.phone} onChange={onChange} name="phone" required />
                </div>
                <div className="input-box">
                  <span className="details">Address</span>
                  <input type="text" value={contact.address} onChange={onChange} name="address" required />
                </div>
                <div className="input-box">
                  <span className="details">Title</span>
                  <input type="text" value={contact.title} onChange={onChange} name="title" required />
                </div>
                <div className="input-box">
                  <span className="details">Status</span>
                  <input type="text" value={contact.status} onChange={onChange} name="status" required />
                </div>
              </div>
              <div className="form_footer">
                <button type="submit" className="btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <form style={{ display: 'none' }}>
        <input type='file' ref={inputRef} onChange={(event) => updatePhoto(event.target.files![0])} name='file' accept='image/*' />
      </form>
    </>
  );
};

export default ContactDetail;
