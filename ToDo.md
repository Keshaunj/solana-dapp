

---------FEb 9Th--------------

- **  USer Transaction **
- Make sure to have full CRUD
- make updates and deletes 

-** Sign IN**
- Make sign in forum that works
- do balace/wallet schema: balce:number ,date:may 5 1:20 pm,recived: wtc

-----To DO ---------
Make frontend connect to backend for
The errors suggest there are a few issues to fix. The main problem is that the frontend can't reach your backend endpoint. Let's fix both the Dashboard and the API connection:

First, you need to set up the correct API URL in your frontend. Add this to your vite.config.js:

**----**   Work on this error tonight!!
ImportWallet.jsx:45 
            
           ImportWallet.jsx:45 
            
            
  POST http://localhost:5173/auth/check-balance 404 (Not Found)

ImportWallet.jsx:63 Error checking balance: SyntaxError: Failed to execute 'json' on 'Response': Unexpected end of JSON input
    at checkBalance (ImportWallet.jsx:56:42)
checkBalance	@	ImportWallet.jsx:63
        &&&&&
        By checking response.ok, you ensure that you only attempt to parse the response as JSON if it was successful. If the response isn't OK, you can handle the error appropriately.

Summary:
Update your frontend to send the request to the correct URL (http://localhost:3000/auth/check-balance).
Ensure the backend responds with a proper JSON response in your checkBalance function.
Update your fetch request to handle failed responses gracefully and only parse JSON when the response is valid.
Let me know if this resolves the issue or if you need further assistance!



Tkae away this error if you get it Error fetching balance. Please try again. After deleting wallet, this error should dispear or refresh to nbormal once previos wallet is deleted and make a-option to clrea waller or delete && delted wallet from database like crud make crud! maybe one wallet at a time or many so i guess one to many or somethinglike that manybe many to one do your reaseach!

**--**curl -X POST http://localhost:3000/auth/check-balance \
-H "Content-Type: application/json" \
-d '{"walletAddress": "3muUNQygyoLab3SvjuNsT63JxoqzDqq7Y5MwJfpeBeNK", "network": "mainnet"}'
{"balance":0.0009}%    **-------------------------**                                                                                                             
➜  Backend git:(main) ✗ curl

------------Also----------
 amke sure users wallets and profile info are saved to there profile not just a new profile with refresh everytrhing make a tab or profile wit hwallet eother already imported afyter they log back in instead of  them import there pre exsting wallets!



