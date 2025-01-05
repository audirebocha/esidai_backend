import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import frontend_URL from '../config.js'

//Models
import users from '../Models/users.js'
import organisations_schema from '../Models/organisation.js'

//firebase database
import db from '../firebase_connection/firebase_connection.js'





const router = express.Router()
router.use(express.json())
router.use(bodyParser.json())
router.use(cors({
  origin: [frontend_URL, "*"],
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
  credentials: true
}));

router.get('/', async (req, res) => {
  res.json({ message: "Hello from backend's Data API" })
})

router.post("/sensor_data", async (req, res) => {
  var data = req.body;
  //find the organisations under this body
  try {
    const organization = await organisations_schema.findById(data['org_id']);
    if (!organization) {
      console.error('Organization not found');
      return;
    }

    const farm = organization.farms.id(data['farm_id']);
    if (!farm) {
      console.error('Farm not found');
      return;
    }

    farm.data.push(data['sensor_data']);
    await organization.save();

    console.log('Sensor data added successfully!');
    var ref = db.ref("Esidai/" + data['org_id'] + "/" + data['farm_id'] + "/data/" + data['sensor_data']['sensor_id'])
    data['sensor_data']['time_stamp'] = new Date().toJSON()
    ref.set(data['sensor_data']).then((ref) => { console.log("New data stored") }).catch((err) => { console.log("error:", err) })
    res.json({ message: "ok" })

  } catch (error) {
    console.error(error);
    res.json({ m: "not ok" })
  }
})



router.post("/get_data", async (req, res) => {
  var data = req.body;
  const orgId = data['org_id'];
  const farmId = data['farm_id'];
  const startDate = data['from_date'];
  const endDate = data['to_date'];
  try {
    const result = await organisations_schema.aggregate([
      // Match the organization by ID
      {
        $match: {
          _id: new mongoose.Types.ObjectId(orgId)
        }
      },
      // Unwind the farms array
      { $unwind: "$farms" },
      // Match the specific farm by ID
      {
        $match: {
          "farms._id": new mongoose.Types.ObjectId(farmId)
        }
      },
      // Unwind the data array to process individual entries
      { $unwind: "$farms.data" },
      // Match data entries within the date range
      {
        $match: {
          "farms.data.date": {
            $gte: new Date(startDate), // Start date
            $lte: new Date(endDate)   // End date
          }
        }
      },
      // Project the desired fields
      {
        $project: {
          _id: 0, // Exclude _id if not needed
          "farms.data": 1 // Include only the filtered data
        }
      }
    ]);

    res.json(result.map(entry => entry.farms.data)); // Return only the filtered data
  } catch (error) {
    console.error("Error querying data by date range with Mongoose:", error);
    throw error;
    res.json({ m: "not ok" })
  }
})



router.post('/data_count', async (req, res) => {
  var data = req.body;
  const orgId = data['org_id'];
  const farmId = data['farm_id'];
  const startDate = data['from_date'];
  const endDate = data['to_date'];
  try {
    const result = await organisations_schema.aggregate([
      // Match the organization
      {
        $match: {
          _id: new mongoose.Types.ObjectId(orgId)
        }
      },
      // Unwind the farms array
      { $unwind: "$farms" },
      // Match the specific farm
      {
        $match: {
          "farms._id": new mongoose.Types.ObjectId(farmId)
        }
      },
      // Unwind the data array
      { $unwind: "$farms.data" },
      // Match the data entries within the date range
      {
        $match: {
          "farms.data.date": {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      // Count the matching documents
      {
        $count: "count"
      }
    ]);

    // Extract the count value or default to 0 if no matches
    res.json(result.length > 0 ? {count:result[0].count} : {count:0})
  } catch (error) {
    console.error("Error counting farm data by date range:", error);
    throw error;
    res.json({ m: 'not ok' })
  }
})




export default router