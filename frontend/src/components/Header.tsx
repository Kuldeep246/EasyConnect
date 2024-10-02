import React from 'react';

interface HeaderProps {
  toggleModal: (value: boolean) => void;
  nbOfContacts: number;
}

const Header: React.FC<HeaderProps> = ({ toggleModal, nbOfContacts }) => {
  return (
    <header className='header'>
      <div className='container'>
        <h3>Contact List ({nbOfContacts})</h3>
        <button onClick={() => toggleModal(true)} className='btn'>
          <i className='bi bi-plus-square'></i> Add New Contact
        </button>
      </div>
    </header>
  );
};

export default Header;
