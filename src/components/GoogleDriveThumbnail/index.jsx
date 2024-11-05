const GoogleDriveThumbnail = ({ fileId }) => {
  // Extract file ID from the full Google Drive link
  const extractFileId = (link) => {
    const match = link.match(/\/d\/(.+?)\//);
    return match ? match[1] : null;
  };

  const thumbnailUrl = `https://drive.google.com/thumbnail?id=${extractFileId(fileId)}&sz=w1000`;

  return (
    <div className="google-drive-thumbnail">
      <img 
        src={thumbnailUrl} 
        alt="File Thumbnail" 
        style={{ maxWidth: '100%', height: 'auto' }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/path/to/fallback-image.png'; // Replace with your fallback image
        }}
      />
    </div>
  );
};

export default GoogleDriveThumbnail;

// Usage example:
// <GoogleDriveThumbnail fileId="https://drive.google.com/file/d/1_ArDoi-iwWNw2LHZnpd_7Xz2iWKxTA7u" />