'use client';

import { useEffect, useState } from 'react';
import { Mail, User, Calendar, MessageSquare, Clock } from 'lucide-react';
import { X } from 'lucide-react';

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      console.log('Fetching contacts...');
      const response = await fetch('/api/contact');
      console.log('Response status:', response.status);
      
      if (response.status === 401) {
        setError('Unauthorized access. Please login again.');
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      setContacts(data.contacts || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to load contact messages');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contact messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Messages</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchContacts}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pesan dan Masukan Pelanggan</h1>
        <p className="text-gray-600 mt-2">Lihat semua pesan yang dikirim melalui form kontak</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pesan</p>
              <p className="text-3xl font-bold text-gray-900">{contacts.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pesan Hari Ini</p>
              <p className="text-3xl font-bold text-gray-900">
                {contacts.filter(contact => {
                  const today = new Date().toDateString();
                  const contactDate = new Date(contact.createdAt).toDateString();
                  return today === contactDate;
                }).length}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pesan Terbaru</p>
              <p className="text-sm text-gray-900">
                {contacts.length > 0 ? formatDate(contacts[0].createdAt) : 'Belum ada pesan'}
              </p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      {contacts.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum ada pesan</h3>
          <p className="text-gray-600">Pesan dari form kontak akan muncul di sini</p>
        </div>
      ) : (
        <>
          {/* Desktop Table (md ke atas) */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengirim</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pesan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Dikirim</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-100 rounded-full p-2 mr-3">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 max-w-[150px] truncate" title={contact.name}>{contact.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {contact.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium max-w-[400px] truncate" title={contact.subject}>{contact.subject}</div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="text-sm text-white bg-orange-500 hover:bg-orange-600 rounded px-4 py-2 transition-colors duration-200"
                          onClick={() => setSelectedContact(contact)}
                        >
                          Lihat Pesan
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(contact.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List (md ke bawah) */}
          <div className="md:hidden space-y-4">
            {contacts.map((contact) => (
              <div key={contact._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-1">
                  <div className="bg-gray-100 rounded-full p-2">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-gray-900 truncate" title={contact.name}>{contact.name}</div>
                    <div className="text-sm text-gray-500 flex items-center truncate">
                      <Mail className="h-4 w-4 mr-1" />
                      {contact.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-500">Subject:</span>
                  <span className="text-sm text-gray-900 truncate" title={contact.subject}>{contact.subject}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-500">Waktu:</span>
                  <span className="text-sm text-gray-700 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(contact.createdAt)}
                  </span>
                </div>
                <div className="flex justify-end">
                  <button
                    className="text-sm text-white bg-orange-500 hover:bg-orange-600 rounded px-4 py-2 transition-colors duration-200"
                    onClick={() => setSelectedContact(contact)}
                  >
                    Lihat Pesan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {/* Modal Detail Pesan */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedContact(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-orange-600">Detail Pesan Pengguna</h2>
            <div className="mb-2 text-gray-800 break-words whitespace-normal max-w-full"><b>Nama:</b> {selectedContact.name}</div>
            <div className="mb-2 text-gray-800 break-words whitespace-normal max-w-full"><b>Email:</b> <span className="break-all">{selectedContact.email}</span></div>
            <div className="mb-2 text-gray-800 break-words whitespace-normal max-w-full"><b>Subject:</b> <span className="break-all">{selectedContact.subject}</span></div>
            <div className="mb-2 text-gray-800 break-words whitespace-normal max-w-full"><b>Pesan:</b>
              <div className="whitespace-pre-wrap break-words bg-gray-100 rounded p-3 max-h-60 overflow-auto border border-orange-200 text-gray-800">
                {selectedContact.message}
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-2"><b>Waktu:</b> {formatDate(selectedContact.createdAt)}</div>
          </div>
        </div>
      )}
    </div>
  );
}