const postData = async () => {
    const url = "https://672e1217229a881691eed80f.mockapi.io/scores";
    let username = document.getElementById("pseudo");
  
    const data = {
      createdAt: new Date().toISOString(),
      username: username,
      avatar:
       "https://yoolk.ninja/wp-content/uploads/2020/06/Akira-Kaneda-1024x819.png",
      score: 100,
      website_url: "kevinlibaude.github.io/ClickFast",
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const result = await response.json();
      console.log("Data posted successfully:", result);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };
  
  postData();