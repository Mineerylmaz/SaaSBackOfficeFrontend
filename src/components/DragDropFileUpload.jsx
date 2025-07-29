import React, { useState, useCallback, useEffect } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from 'jwt-decode';


const DragDropFileUpload = ({ plan }) => {

  const [files, setFiles] = useState([]);
  const [maxFileSize, setMaxFileSize] = useState(plan?.max_file_size || 0);


  const localUser = localStorage.getItem("user");
  const localSelectedUser = localStorage.getItem("selectedUser");
  const user = localUser ? JSON.parse(localUser) : null;
  const selectedUser = localSelectedUser ? JSON.parse(localSelectedUser) : null;

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;

  const isSuperAdmin = decoded?.role === "superadmin";
  const currentUser = isSuperAdmin && selectedUser ? selectedUser : user;
  const isSuperadminViewingOther = isSuperAdmin && selectedUser && selectedUser.id !== user?.id;
  useEffect(() => {
    setMaxFileSize(plan?.max_file_size || 0);
  }, [plan]);

  const getSelectedUserSettings = async (userId) => {
    const response = await fetch(`http://localhost:5000/api/userSettings/settings/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data?.plan?.max_file_size || 0;
  };

  useEffect(() => {
    const fetchLimit = async () => {
      try {
        if (currentUser?.id) {
          const limit = isSuperAdmin && selectedUser
            ? await getSelectedUserSettings(selectedUser.id)
            : currentUser?.plan?.max_file_size || 0;
          setMaxFileSize(limit);
        }
      } catch (err) {
        console.error("Plan bilgisi alınamadı", err);
      }
    };
    fetchLimit();
  }, [currentUser?.id]);

  const handleInputChange = (e) => handleFiles(e.target.files);

  const handleFiles = useCallback((fileList) => {
    const newFiles = Array.from(fileList);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const totalSizeMB = files.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024);
  const overLimitFiles = files.filter(file => (file.size / (1024 * 1024)) > maxFileSize);

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (isSuperadminViewingOther) {
      Swal.fire("Yetkisiz", "Superadmin başka bir kullanıcı adına dosya yükleyemez.", "error");
      return;
    }
    if (files.length === 0) {
      Swal.fire("Dosya yok", "Lütfen önce dosya seçin veya sürükleyip bırakın.", "warning");
      return;
    }
    if (overLimitFiles.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Dosya boyutu aşıldı!",
        html: `Aşağıdaki dosyalar planınızın maksimum dosya boyutunu aşıyor:<br><ul style="text-align:left;">${overLimitFiles.map(f => `<li>${f.name} (${(f.size / (1024 * 1024)).toFixed(2)} MB)</li>`).join("")}</ul>`
      });
      return;
    }
    Swal.fire("Başarılı!", "Tüm dosyalar kabul edildi.", "success");
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        width: "100%",
        margin: "2rem auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "0 16px",
        boxSizing: "border-box"
      }}
    >
      <h2>Dosya / Klasör Yükleme</h2>
      <p>Plan dosya limiti: <strong>{maxFileSize} MB</strong></p>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: "2px dashed #007BFF",
          borderRadius: 10,
          padding: 30,
          textAlign: "center",
          color: "#007BFF",
          cursor: "pointer",
          marginBottom: 20,
          userSelect: "none",
        }}
      >
        Dosyaları buraya sürükleyin veya aşağıdan seçin
      </div>
      <input
        type="file"
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={handleInputChange}
        disabled={isSuperadminViewingOther}
        title={
          isSuperadminViewingOther
            ? "Superadmin başka bir kullanıcı adına dosya seçemez."
            : "Dosya veya klasör seçin"
        }
        style={{
          display: "block",
          marginBottom: 20,
          cursor: isSuperadminViewingOther ? "not-allowed" : "pointer",
          opacity: isSuperadminViewingOther ? 0.6 : 1
        }}
      />



      {files.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3>Seçilen Dosyalar ({files.length})</h3>
          <ul style={{
            maxHeight: 200,
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: 10,
            borderRadius: 6,
            fontSize: 14
          }}>
            {files.map((file, index) => {
              const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
              const isOverLimit = sizeMB > maxFileSize;
              return (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 5,
                    color: isOverLimit ? "red" : "inherit"
                  }}
                >
                  <span title={file.webkitRelativePath || file.name}>
                    {file.webkitRelativePath || file.name} - {sizeMB} MB
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#d33",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    X
                  </button>
                </li>
              );
            })}
          </ul>
          <p><strong>Toplam boyut:</strong> {totalSizeMB.toFixed(2)} MB</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={isSuperadminViewingOther}
        style={{
          backgroundColor: isSuperadminViewingOther ? "#ccc" : "#007BFF",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: isSuperadminViewingOther ? "not-allowed" : "pointer",
          fontSize: 16,
          width: "100%",
          padding: "10px"
        }}
      >
        {isSuperadminViewingOther ? "Yükleme Devre Dışı" : "Yükle"}
      </button>

    </div>
  );
};

export default DragDropFileUpload;
