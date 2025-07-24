import React, { useState, useCallback } from "react";
import Swal from "sweetalert2";

const DragDropFileUpload = () => {
  const plan = JSON.parse(localStorage.getItem("selectedPlan")) || { max_file_size: 10 };

  const [files, setFiles] = useState([]);


  const handleFiles = useCallback((fileList) => {

    const newFiles = Array.from(fileList);


    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);


  const handleInputChange = (e) => {
    handleFiles(e.target.files);
  };


  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };


  const totalSizeMB = files.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024);


  const overLimitFiles = files.filter(file => (file.size / (1024 * 1024)) > plan.max_file_size);


  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };


  const handleUpload = () => {
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
        maxWidth: 600,
        margin: "2rem auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative",

        width: "600px",
      }}
    >

      <h2>Dosya / Klasör Yükleme</h2>
      <p>Plan dosya limiti: <strong>{plan.max_file_size} MB</strong></p>

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
        style={{ display: "block", marginBottom: 20 }}
      />

      {files.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3>Seçilen Dosyalar ({files.length})</h3>
          <ul style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #ccc", padding: 10, borderRadius: 6, fontSize: 14 }}>
            {files.map((file, index) => {
              const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
              const isOverLimit = sizeMB > plan.max_file_size;
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
                    style={{ background: "none", border: "none", color: "#d33", cursor: "pointer", fontWeight: "bold" }}
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
        style={{

          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 16,
          width: "100%"
        }}
      >
        Yükle
      </button>
    </div>
  );
};

export default DragDropFileUpload;
