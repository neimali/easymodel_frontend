import {
  Typography,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import config from "../../config";
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import CameraIcon from '@mui/icons-material/Camera';
import DeleteIcon from '@mui/icons-material/Delete';

export function ImageUpload() {
  const [image, setImage] = useState(null); // 保存上传的图片文件
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // 保存图片预览的URL
  const [uploading, setUploading] = useState(false); // 上传状态
  const [uploaded, setUploaded] = useState(false); // 图片传送状态
  const [videoUrl, setVideoUrl] = useState(null); // 保存视频预览的预签名 URL
  const [modelGenerated, setModelGenerated] = useState(false); // 模型生成状态
  
  // 处理拖拽上传
  const { getRootProps, getInputProps } = useDropzone({
      accept: {
        'image/png': ['.png'],
        'image/jpg': ['.jpg'],
        'image/jpeg': ['.jpeg'],
      },
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
    
        if (file) {
          if (file.size <= 5 * 1024 * 1024) {
            setImage(file);
            const objectUrl = URL.createObjectURL(file);
            setImagePreviewUrl(objectUrl);
          } else {
            alert("File size cannot exceed 5MB.");
          }
        }
      },
    });

  // 处理图片上传 
  const handleSubmit = async () => {
    if (!image) {
      alert("请上传图片文件");
      return;
    }
    setUploading(true);

    // 创建 FormData 对象，用于发送图片文件
    const formData = new FormData();
    formData.append("file", image); // 将图片文件添加到表单数据中

      try {
          const response = await axios.post(config.backendUrl + 'uploads/upload_image/', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
          });

          console.log('上传成功:', response.data);
          alert('图片已成功上传！');
          handleRemoveImage(); // 上传成功后清理状态
          setUploaded(true);
      } catch (error) {
          console.error('上传失败:', error);
          alert('图片上传失败，请重试。');
      } finally {
          setUploading(false); // 上传结束，重置状态
      }
  };

  // 清除已选择的图片
  const handleRemoveImage = () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl); // 释放对象 URL
        setImagePreviewUrl(null);
      }
      setImage(null);
    };
  

  // 组件卸载时释放对象 URL
  useEffect(() => {
      return () => {
          if (imagePreviewUrl) {
              URL.revokeObjectURL(imagePreviewUrl); // 释放对象 URL
          }
      };
  }, [imagePreviewUrl]);

  // 处理生成按钮点击
  const handleGenerate = async () => {
    try {
      // 向后端发送请求生成模型文件
      const response = await axios.post('/api/generate-model', {
        // 可以在此传递必要的参数，例如上传的图片的URL或其他数据
        imageUrl: 'your-uploaded-image-url',
      });
  
      // 检查响应的数据
      const presignedUrls = response.data.presignedUrl;
      setVideoUrl(presignedUrls['sample_gs.mp4'])
      setModelGenerated(true)
  
      // 你可以将预签名 URL 用于后续的操作，例如下载文件
      console.log('预签名URL:', presignedUrl);
  
    } catch (error) {
      console.error('请求失败:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Upload image</h2>

      {/* 使用 drag & drop 上传图片区域 */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed p-4 mb-4 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        <Typography color="gray" className="font-medium">
        Drag and drop file here to upload, or click to select file
        </Typography>
      </div>

      {/* 图片选择后预览 */}
      {imagePreviewUrl && (
        <div className="mb-4">
          <h3>Preview:</h3>
          <img
            src={imagePreviewUrl}
            alt="preview"
            style={{ width: "15vw", height: "auto" }}
            className="mb-2"
          />
          <Button onClick={handleRemoveImage} variant="outlined" color="error" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </div>
      )}

      <div className="flex gap-4">
        <Button onClick={handleSubmit} disabled={uploading} variant="contained" color="primary" startIcon={<UploadIcon />}>
          Upload Images
        </Button>
  
        <Button onClick={handleGenerate} disabled={!uploaded} variant="contained" color="primary" startIcon={<CameraIcon />}>
          Generate
        </Button>

      </div>
      {/* 视频预览 */}
      <div className="mb-4">
        <h3>3D Model Preview:</h3>
        {videoUrl ? (
          <video 
            src={videoUrl} 
            controls 
            style={{ width: "30vw", height: "auto" }} 
            className="border rounded-lg"
          />
        ) : (
          <div 
            className="flex items-center justify-center border border-dashed rounded-lg" 
            style={{ width: "30vw", height: "15vw" }}
          >
            <Typography color="gray" className="font-medium">
              Generate 3D model and preview here
            </Typography>
          </div>
        )}
      </div>
      <Button variant="contained" color="primary" disabled={!modelGenerated} startIcon={<DownloadIcon />}>
        Download Files
      </Button>
    </div>
);
}

export default ImageUpload;
