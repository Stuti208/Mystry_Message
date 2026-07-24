import mongoose from "mongoose"

type ConnectionObject = {
	isConnected?:number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<{ success: boolean; message: string }> {
	if (connection.isConnected) {
		console.log("Already connected to database")
		return { success: true, message: "Already connected to database" }
	}

	try {
		const db = await mongoose.connect(process.env.MONGODB_URI || '')
		connection.isConnected = db.connections[0].readyState;

		console.log("DB connected successfully")
        return { success: true, message: "DB connected successfully" }
	}
	catch (error) {
		console.log("Database connected failed", error)
        return { success: false, message: `Database connection failed: ${error instanceof Error ? error.message : "Unknown error"}` }
	}
}


export default dbConnect;
