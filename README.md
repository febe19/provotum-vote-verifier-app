# Provotum Vote Verifier App
by [febe19](https://github.com/febe19)

## What it is
The provotum vote verifier app is a progressive web app used for challenge-or-cast based vote-verification with Provotum. Provotum is a remote electronical voting system developet at the Communication Systems Research Group (CSG) from the Department of Informatics (IfI) at University of Zurich (UZH). 
This vote verfier app is developed as part of my master thesis.

## How it works
The provotum vote verifier app is an application which basically scanns qr codes shown by the [provotum vote frontend](https://github.com/febe19/voter) and then encrypts the ballot again. Thereby it checks if the encryption is done correctly and if the reencryption matches the encrypted ballot. Furthermore, it lets a user check if the received answers are truly the given ones. All this helps detecting malfunctioning or untrustworthy voting devices. 

## Usage
Voters currently can acces the application via whis link (https://provotum-vote-verifier-app.web.app/) since the app is hosted on fireabse currently. 

## Development
The Progressive Web App is (PWA) is created with the react [PWA-template](https://create-react-app.dev/docs/making-a-progressive-web-app/) and written in typescript. 

Fot development the common react start scripts can be used: 
- Start: `npm start` --> This will start the application on [localhost:3000](https://localhost:300)
- Build: `npm run build` --> Creates a new build folder which is needed for deployment. 

Following libraries are used: 
- [@hoal/evote-crypto-ts](https://www.npmjs.com/package/@hoal/evote-crypto-ts)
- [@emeraldpay/hashicon-react](https://www.npmjs.com/package/@emeraldpay/hashicon-react)
- [material-ui](https://material-ui.com/)
- [react-qr-reader](https://www.npmjs.com/package/react-qr-reader)
- [redux](https://redux.js.org/introduction/getting-started)

## Hosting
Currently the application is hosted on fireabse. Thus, with the command `fireabse deploy` the build folder will be hosted on firebase: https://provotum-vote-verifier-app.web.app/
