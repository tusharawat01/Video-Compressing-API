'use client'

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 10; // Adjust if necessary

export default function GetAllFiles() {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to store errors

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await fetch(`http://localhost:8000/api/v1/files/getFiles?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
        const data = await response.json();

        if (data.success) {
          setFiles(data.data.data);
          setTotalPages(data.data.totalPages); // Use totalPages from response
        } else {
          setError('Failed to fetch files'); // Set error message if fetch fails
        }
      } catch (error) {
        setError('An error occurred while fetching files'); // Set error message if catch block is hit
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return; // Ensure valid page number
    setCurrentPage(pageNumber);
    setLoading(true);
  };

  return (
    <div className="p-6 bg-cyan-800 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">All Files</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p> // Show error message if any
      ) : (
        <>
          {files.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {files.map(file => (
                  <div key={file._id} className="bg-cyan-700 p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold text-black; mb-2 truncate">{file.originalName}</h2>
                    <video controls className="w-full h-48 object-cover mb-2">
                      <source src={file.fileUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <a href={file.fileUrl} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                      View Video
                    </a>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 mx-1 rounded-lg ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500">No files found</p> // Show no files found message
          )}
        </>
      )}
      <ToastContainer />
    </div>
  );
}
