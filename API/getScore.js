const getData = async () => {
    const url = "https://672e1217229a881691eed80f.mockapi.io/scores";
  
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      console.log("Data retrieved successfully:", data);
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };
  
  getData();