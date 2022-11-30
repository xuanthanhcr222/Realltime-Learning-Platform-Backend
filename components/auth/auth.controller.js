const users = require('../../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')

function generateAccessToken(user) {
	return jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"60s"});
}

function generateRefreshToken(user) {
	return jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {expiresIn:"1d"});
}

function generateVerifyToken(email) {
	return jwt.sign({email:email}, process.env.VERIFY_TOKEN_SECRET, {expiresIn:"1d"});
}

function generateEmailTemplate(link) {
	return `
	    <!DOCTYPE html>
        <html>
            <head>
			    <meta charset="UTF-8">
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<style>
					h1{
						font-size: 20px;
						padding: 5px;
					}
				</style>
			</head>
			<body>
					<div>
						<div style="max-width: 620px; margin:0 auto; font-family:sans-serif;color:#272727;background: #f6f6f6">
							<h1 style="padding:10px;text-align:center;color:#272727;">
							We are delighted to welcome you to join our platform.
							</h1>
							<p style="text-align:center;">Please verify your email address to continue.</p>
							<div style="overflow: hidden;display: flex;justify-content: center;align-items: center;">
								<a href=${link} style="background: #0000D1; text-align:center;font-size:16px;margin:auto;padding:15px 30px; color:#ffffff; text-decoration:None;">VERIFY</a>
							</div>
						</div> 
                    </div>
           </body>`
}

function sendMailVerification(email) {
	try {
			const transporter=nodemailer.createTransport({
				service: 'gmail',
                auth: {
					user: process.env.EMAIL,
					pass: process.env.PASSWORD
				}
			});
			let token = generateVerifyToken(email);
			let url = process.env.BASEURL+'/verify/'+token;
			const mailOptions = {
				from: process.env.EMAIL,
                to: email,
				subject: 'Verify Your Account On Realtime Learning Platform',
				html: generateEmailTemplate(url),
			}

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
                    console.log(error);
				}
				else{
					console.log("Email sent successfully. Info: " + info.response);
				}
			})
	} catch (error) {
        console.log(error);
	}

}

exports.checkLogged = async (req,res) => {
    try {
		const user = await users.findById(req.userId).select('-password')
		if (!user)
			return res.status(400).json({ success: false, message: 'User not found' })
		res.json({ success: true, user })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
}

exports.register = async (req,res) => {

    const { name, email, password} = req.body
    if (!name || !email || !password)
    {
        return res
            .status(400)
            .json({ success: false, message: 'Missing information(s).' })
    }
    try {
		// Check for existing user
		let user = await users.findOne({ email: email })

		if (user)
        {
			return res
				.status(400)
				.json({ success: false, message: 'Email already taken.' })
        }
		// All good
		hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new users({ name, email, password: hashedPassword })
		await newUser.save()
		sendMailVerification(email);
		res.json({
			success: true,
			newUser,
			message: 'Account created successfully.'
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error.' })
	}
}

exports.login = async (req,res) => {
    const { email, password } = req.body
    if (!email || !password)
    {
    return res
        .status(400)
        .json({ success: false, message: 'Missing information(s).' })
    }
    try {
		// Check for existing user
		const user = await users.findOne({ email})
		if (!user)
        {
			return res
				.status(400)
				.json({ success: false, message: 'Incorrect email or password.' })
        }

		// Username found
		const passwordValid = await bcrypt.compare(password, user.password)
		if (!passwordValid)
        {
			return res
				.status(400)
				.json({ success: false, message: 'Incorrect email or password.' })
        }

		// All good
		// Return token
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		//Update token
		const filter = { email: email };
		const update = { refreshToken: refreshToken };
		await users.findOneAndUpdate(filter, update);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
            secure: false,
			path: "/",
			sameSite: "strict",
		})
		res.json({
			success: true,
			message: 'User logged in successfully.',
			accessToken
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error.' })
	}
}

exports.requestRefreshToken = async (req, res) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken)
		return res
			.status(401)
			.json({ success: false, message: 'Refresh token not found.' })

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err)
		{
			console.log(error)
			return res.status(403).json({ success: false, message: "You're not authenticated." })
		}
		newAccessToken = generateAccessToken(user);
	})

}

exports.verifySuccess = async (req, res) => {
	const token = req.params.token
	console.log(token);
	try {
		const decoded = jwt.verify(token, process.env.VERIFY_TOKEN_SECRET)
		email = decoded.email
		await users.findOneAndUpdate(
			{ email: email },{ $set: { verified: true }}
		)
		res.json({ success: true, message: "Verify successfully." })
	} catch (error) {
		console.log(error)
		return res.status(400).json({ success: false, message: "Can not verify." })
	}

}

exports.logout = async (req,res) => {
	const token = req.cookies.refreshToken;
	res.clearCookie('refreshToken');
	const filter = { refreshToken: token };
	const update = { refreshToken: "" };
	await users.findOneAndUpdate(filter, update);
    return res.json({ success: true, message: 'Logged out successfully.' })
}