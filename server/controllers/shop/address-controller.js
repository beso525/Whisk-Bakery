const Address = require('../../models/Address')

const addAddress = async(req,res) => {
  try {
    const userId = req.user.id;

    const { address, city, postalcode, phone, notes } = req.body;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid User Session"
      })
    }
    
    if (!address || !city || !postalcode || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data provided'
      })
    }

    const newAddress =  new Address({
      userId, address, city, postalcode, phone, notes
    })

    await newAddress.save();

    res.status(201).json({
      success: true,
      data: newAddress
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error"
    })
  }
}

const getAddress = async(req,res) => {
  try {

    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required"
      })
    }

    const address = await Address.find({userId})

    res.status(200).json({
      success: true,
      data: address
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error"
    })
  }
}

const editAddress = async(req,res) => {
  try {
    const { addressId} = req.params;
    const userId = req.user.id;
    const formData = req.body;

    if (!userId || !addressId) {
       return res.status(400).json({
        success: false,
        message: 'Invalid data provided'
      })
    }
    
    const address = await Address.findOneAndUpdate({
      _id: addressId, userId
    }, formData, {
      new: true
    })

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      })
    }

    res.status(200).json({
      success: true,
      data: address
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error"
    })
  }
}

const deleteAddress = async(req,res) => {
  try {
    const {addressId} = req.params;
    const userId = req.user.id;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User or address id is required"
      })
    }

    const address = await Address.findOneAndDelete({
      _id: addressId, userId
    })

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "Address deleted"
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error"
    })
  }
}

module.exports = { addAddress, editAddress, deleteAddress, getAddress}