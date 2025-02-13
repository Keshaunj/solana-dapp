// const checkBalanceAPI = async (walletAddress) => {
//   try {
//     const token = localStorage.getItem("token");
//     console.log("Token being used:", token);  // Debugging step

//     if (!token) {
//       throw new Error("Authentication token is missing. Please log in again.");
//     }

//     const response = await fetch("http://localhost:3000/auth/check-balance", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,
//       },
//       body: JSON.stringify({ walletAddress }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("API Error:", errorData);  // Debugging step
//       throw new Error(errorData.error || "Error fetching balance. Please try again.");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error in checkBalanceAPI:", error.message);  // Debugging step
//     throw new Error(error.message || "Error fetching balance. Please try again.");
//   }
// };
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const checkBalanceAPI = async (walletAddress) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/check-balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error fetching balance. Please try again.");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || "Error fetching balance. Please try again.");
    }
};