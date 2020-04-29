const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
	if (context.auth.token.admin !== true) {
		return {
			error: 'Nie masz uprawnień, by dodawać nowych administratorów, je😡ny hakerze!'
		}
	}
	return admin.auth().getUserByEmail(data.email).then(user => {
		return admin.auth().setCustomUserClaims(user.uid, {
			admin: true
		});
	}).then(() => {
		return {
			message: `Sukces! ${data.email} został właśnie administratirem`
		}
	}).catch(err => {
		return err
	})
})