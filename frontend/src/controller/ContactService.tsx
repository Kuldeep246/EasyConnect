import axios, { AxiosResponse } from "axios";

const API_URL = 'http://localhost:8080/contacts';

interface Contact {
    id?: string;
    name: string;
    email: string;
    phone: string;
}

export async function saveContact(contact: Contact): Promise<AxiosResponse> {
    return await axios.post(API_URL, contact);
}

export async function getContacts(page: number = 0, size: number = 10): Promise<AxiosResponse> {
    return await axios.get(`${API_URL}?page=${page}&size=${size}`);
}

export async function getContact(id: string): Promise<AxiosResponse> {
    return await axios.get(`${API_URL}/${id}`);
}

export async function updateContact(contact: Contact): Promise<AxiosResponse> {
    return await axios.put(API_URL, contact); // Changed to PUT, assuming this is an update
}

export async function udpatePhoto(formData: FormData): Promise<AxiosResponse> {
    return await axios.put(`${API_URL}/photo`, formData);
}

export async function deleteContact(id: string): Promise<AxiosResponse> {
    return await axios.delete(`${API_URL}/${id}`);
}
