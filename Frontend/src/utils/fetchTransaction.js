const sendTransaction = async (senderPrivateKey, recipientAddress, amount) => {
    const token = localStorage.getItem('token');  // Retrieve JWT token for authentication

    if (!token) {
        throw new Error("No token found. Please log in first.");
    }

    try {
        const response = await fetch('http://localhost:3000/api/send-transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  // Include token for authentication
            },
            body: JSON.stringify({
                senderPrivateKey: JSON.stringify(senderPrivateKey),  // Convert array to string
                recipientAddress,
                amount,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response:", errorData);
            throw new Error(`HTTP error! Status: ${response.status} - ${errorData.error || "Unknown error"}`);
        }

        const data = await response.json();
        console.log('Transaction success:', data);
        return data;
    } catch (error) {
        console.error('Error sending transaction:', error);
        return { error: error.message };
    }
};

export default sendTransaction;
