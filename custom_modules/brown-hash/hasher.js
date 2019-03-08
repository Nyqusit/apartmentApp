let app = {};

let inc = 0;
let salt = ['budddy', '3453', 'sfup' ,'bigllnye' ,'sarlad' ,'po5tatoe' ,'u6rgay'];
let num =['33','734','345','3','1'];

app.createHash = function(password){
  inc++;
	let newPassword = '';
	for(let i = 0 ; i < password.length; i++){
    // /newPassword += rand.toString();
		let idx = password[i].charCodeAt(0);
		let move = idx-(i%10);
    if(move%2 === 1){
      newPassword += (String.fromCharCode(move) + num[i]);
    }else{
      newPassword += String.fromCharCode(move);

    }
	};
	return newPassword;
}

app.createSalt = function(){
  ++inc;
  return salt[inc%salt.length];
}


module.exports = app;
/*The first 128 Unicode code points are the ASCII characters, which means that any ASCII text is also a UTF-8 text. UCS-2 uses two bytes (16 bits) for each character but can only encode the first 65,536 code points, the so-called Basic Multilingual Plane (BMP).*/
