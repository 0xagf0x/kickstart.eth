# Kickstarter.eth
 This app aims to solve the issue other crowdfunding applications suffer from: fraudulent campaign spending. 

Kickstarter.eth improves on these platforms by implementing a voting system to help regulate campaign spending. 

If the campaign owner wants to spend some of their funded money, they must create a `Request`, detailing address, amount, and what they're spending money on. The `Request` is then voted on by all campaign contributors. 

Once 50%+ approval has been reached, the `Request` will be unlocked and the payment will proceed.



# to deploy a new Campaign Factory + launch the app : 
- `cd ethererum`
- `node compile.js` (deletes existing build folder and rewrite contracts)
- `node deploy.js` (does the actual deployment)
- get that address and paste it into `factory.js`
- `cd` to root and `npm run dev`



<img width="1107" alt="Screen Shot 2021-09-18 at 8 47 31 PM" src="https://user-images.githubusercontent.com/22567920/133912146-b8bcd781-027b-43d3-baf6-dc8e3bccc796.png">

<img width="1088" alt="Screen Shot 2021-09-18 at 9 24 49 PM" src="https://user-images.githubusercontent.com/22567920/133912525-823efbdf-32bf-4868-844a-4c9f679d0683.png">


<img width="1098" alt="Screen Shot 2021-09-18 at 8 47 43 PM" src="https://user-images.githubusercontent.com/22567920/133912147-2291b16d-fe60-4a21-a146-820fba790a8b.png">
