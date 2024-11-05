// import React, { useEffect, useRef, useState } from "react";
// import Typewriter from "typewriter-effect/dist/core";
// import api5 from "../../utils/api5";

// export default function WelcomeBanner() {
//   const typewriterRef1 = useRef(null);
//   const typewriterRef2 = useRef(null);
//   const [showTypewriter2, setShowTypewriter2] = useState(false);
//   const [data, setData] = useState({});

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const typewriter1 = new Typewriter(typewriterRef1.current, {
//       loop: false,
//       delay: 75,
//     });

//     const typewriter2 = new Typewriter(typewriterRef2.current, {
//       loop: false,
//       delay: 70,
//       cursor: null,
//     });

//     typewriter1
//       .typeString(data?.teks_2)
//       .pauseFor(2500)
//       .start()
//       .callFunction(() => {
//         setShowTypewriter2(true); // Show the second typewriter when starting
//         typewriter2
//           .typeString(data?.teks_2)
//           // .pauseFor(2200)
//           .start();
//       });

//     return () => {
//       typewriter1.stop();
//       typewriter2.stop();
//     };
//   }, [data]);

//   const fetchData = async () => {
//     try {
//       const response = await api5.get("/api/beranda");
//       setData(response.data.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   return (
//     <div
//       className="welcome-banner"
//       style={{
//         // position: 'relative',
//         overflow: "hidden",
//         width: "100%",
//         height: "100vh",
//       }}
//     >
//       <img
//         src="/pict/sda.jpg"
//         alt="Sidoarjo"
//         style={{
//           width: "100%",
//           height: "100vh",
//           objectFit: "cover",
//           position: "absolute",
//           top: 0,
//           left: 0,
//           zIndex: -1,
//         }}
//       />
//       {/* Orange transparent overlay */}
//       <div
//         className="absolute inset-0 flex items-center justify-center -top-[64px]"
//         style={{
//           backgroundColor: "rgba(285, 201, 146, 0.4)", // Orange transparent background
//           zIndex: 0,
//         }}
//       ></div>
//       <div
//         className="flex flex-col items-center justify-center gap-4 text-3xl font-bold text-white"
//         style={{
//           position: "relative",
//           zIndex: 1,
//           marginTop: "15%",
//           textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
//         }}
//       >
//         <h1 className="text-3xl">
//           {data?.teks_1}
//         </h1>
//         <div
//           ref={typewriterRef1}
//           className="text-5xl"
//           style={{
//             fontFamily: "Inter",
//             fontWeight: "bold",
//             textAlign: "center",
//             // marginBottom: "1rem",
//           }}
//         ></div>
//         <div
//           ref={typewriterRef2}
//           className="text-2xl"
//           style={{
//             fontFamily: "Assistant",
//             fontWeight: "600",
//             textAlign: "center",
//             backgroundColor: "#f27c35", // Transparent background for the second text
//             padding: "6px 18px",
//             borderRadius: "20px",
//             display: "inline-block",
//             textShadow: "none",
//             opacity: showTypewriter2 ? 1 : 0, // Control visibility
//             transition: "opacity 0.5s ease-in-out", // Smooth transition
//           }}
//         ></div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
import Typewriter from "typewriter-effect/dist/core";
import api5 from "../../utils/api5";
import { Oval } from "react-loader-spinner";

export default function WelcomeBanner() {
  const typewriterRef1 = useRef(null);
  const typewriterRef2 = useRef(null);
  const [showTypewriter2, setShowTypewriter2] = useState(false);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data && typewriterRef1.current && typewriterRef2.current) {
      const typewriter1 = new Typewriter(typewriterRef1.current, {
        loop: false,
        delay: 75,
      });

      const typewriter2 = new Typewriter(typewriterRef2.current, {
        loop: false,
        delay: 70,
        cursor: null,
      });

      typewriter1
        .typeString(data.teks_2)
        .pauseFor(2500)
        .start()
        .callFunction(() => {
          setShowTypewriter2(true);
          typewriter2
            .typeString(data.teks_3)
            .start();
        });

      return () => {
        typewriter1.stop();
        typewriter2.stop();
      };
    }
  }, [data]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api5.get("/api/beranda");
      if (response.data) {
        setData(response.data[0]);
      } else {
        throw new Error("Data not found in the response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // if (isLoading) {
  //   return <div className="py-10 text-center">Loading...</div>;
  // }
  if (isLoading) {
    return (
      <div style={styles.loaderContainer}>
        <Oval
          height={100}
          width={100}
          color="#4fa94d"
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#4fa94d"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="py-10 text-center">No data available</div>;
  }

  return (
    <div
      className="welcome-banner"
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100vh",
        position: "relative",
      }}
    >
      <img
        src={data.link_gambar}
        alt="Sidoarjo"
        style={{
          width: "100%",
          height: "100vh",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center -top-[64px]"
        style={{
          backgroundColor: "rgba(285, 201, 146, 0.4)",
          zIndex: 0,
        }}
      ></div>
      <div
        className="flex flex-col items-center justify-center gap-4 text-3xl font-bold text-white"
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: "15%",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h1 className="text-3xl">{data.teks_1}</h1>
        <div
          ref={typewriterRef1}
          className="text-5xl"
          style={{
            fontFamily: "Inter",
            fontWeight: "bold",
            textAlign: "center",
          }}
        ></div>
        <div
          ref={typewriterRef2}
          className="text-2xl"
          style={{
            fontFamily: "Assistant",
            fontWeight: "600",
            textAlign: "center",
            backgroundColor: "#f27c35",
            padding: "6px 18px",
            borderRadius: "20px",
            display: "inline-block",
            textShadow: "none",
            opacity: showTypewriter2 ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        ></div>
      </div>
    </div>
  );
}

const styles = {
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Full screen height
    width: "100vw",  // Full screen width
    backgroundColor: "#f3f4f6", // Optional background color
  },
};