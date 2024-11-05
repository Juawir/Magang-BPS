import React, { useEffect, useState } from "react";
import api5 from "../../utils/api5";

function convertYouTubeLink(watchLink) {
  // Cek apakah URL valid dan mengandung parameter "v"
  const url = new URL(watchLink);
  const videoId = url.searchParams.get("v");

  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  // Membentuk URL embed dengan parameter si
  const embedLink = `https://www.youtube.com/embed/${videoId}`;

  return embedLink;
}

export default function Desc() {
  // const videoId = "err7OoUvO5w"; // Video ID from the new YouTube link
  // const videoUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  const [data, setData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api5.get("/api/deskripsi");
      if (response.data) {
        setData(response.data[0]);
      } else {
        throw new Error("Data not found in the response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="flex flex-col overflow-hidden bg-white rounded-lg shadow-2xl md:flex-row">
        <div className="flex-1 p-8">
          <h2 className="text-4xl font-bold text-porange">{data.judul}</h2>
          <h3 className="mt-3 text-2xl font-semibold text-porange">
            {data.sub_judul}
          </h3>
          {/* Render HTML safely */}
          {data.isi && (
            <div
              className="mt-3"
              dangerouslySetInnerHTML={{ __html: data.isi }}
            />
          )}
        </div>
        <div className="relative flex items-center justify-center flex-1 p-8">
          <div
            className="relative w-full h-0"
            style={{ paddingBottom: "56.25%" }}
          >
            {data.link_video && (
              <iframe
                src={convertYouTubeLink(data.link_video)}
                title="Desa Cantik Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                rel="0"
                // modestbranding="1"
                className="absolute top-0 left-0 w-full h-full rounded-xl"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
