import Menu from "../MongoDB/models/Menu.js"
import axios from 'axios'
import {validateInput} from '../helpers/index.js'

const create = async (req, res) => {

  if(!req.body.obj) return res.status(400).json({msg: 'Invalid argument, object is empty'})
  if(typeof req.body ==! 'object') return res.status(400).json({msg: 'No valid argument, not a object'})
  if(!req.body)return res.status(400).json({msg: 'Invalid argument'})
  if(Object.keys(req.body.obj).length < 1)return res.status(400).json({msg: 'Invalid argument, object is empty'})

  // check for the inputs
  const obj = JSON.parse(req.body.obj)

  if(validateInput(obj.name) || validateInput(obj.category) || validateInput(obj.price) || validateInput(String(obj.weight)) || validateInput(String(obj.cal)) || validateInput(obj.description) || validateInput(String(obj.available))) return res.status(400).json({msg: 'A input is missing'})

  let objTest
  try {
    objTest = JSON.parse(req.body.obj);
  } catch (error) {
    return res.status(400).json({ msg: 'No valid argument, not a JSON object' });
  }

    //!photo
    // check for the photos
    if (!req.file) return res.status(400).json({ msg: 'No image was provided' });

    // send picture to imgur
    try {
        const response = await axios.post('https://api.imgur.com/3/image', req.file.buffer.toString('base64'), {
          headers: {
            'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
            'Content-Type': 'application/json',
          },
        });
        // setting the link
        obj.photo = response.data.data.link;

        // saving the item
        try {
          const item = new Menu(obj)
          const saveItem = await item.save()
    
          res.status(201).json({msg: 'item saved'})
    
        } catch (error) {
          res.status(400).json({msg: 'item could be saved'})
        }
      } catch (error) {
        console.error('Error al subir la imagen a Imgur:', error);
        res.status(500).json({ msg: 'Error al subir la imagen a Imgur' });
    }
}

const adminList = async (req, res) => {
  try {    
    const items = await Menu.find({category: req.params.id})
    res.json({items})
  } catch (error) {
    res.json({error})
  }
}

const deleteItem = async (req, res) => {
  const {id} = req.params

  try {
    const itemToDelete = await Menu.deleteOne({_id: id})

    res.json({msg: 'se elimino'})
  } catch (error) {
    console.log(error)
    res.json({msg: 'error'})
  }
}

const activeToggle = async (req, res) => {
  const {id} = req.params

  try {
    const itemAct = await Menu.findById(id)
    itemAct.available = !itemAct.available
    const saveItemAct = await itemAct.save()

    res.json({msg: 'Item save'})

  } catch (error) {
    res.json({msg: 'Something went wrong'})
  }
}

const edit = async (req, res) => {

  const {id} = req.params
  const {name, category, price, weight, cal, description, available} = req.body

  try {
    const itemEdit = await Menu.findById(id)

    itemEdit.name = name
    itemEdit.category = category
    itemEdit.price = price
    itemEdit.weight = Number(weight)
    itemEdit.cal = Number(cal)
    itemEdit.description = description
    itemEdit.available = Boolean(available)

    const saveItem = await itemEdit.save()

    res.json({msg: 'paso'})
  } catch (error) {
    console.log(error)
    res.json({msg: 'error'})
  }
}

const editP = async (req, res) => {
  const {id} = req.params,
        obj = JSON.parse(req.body.obj);

  if (!req.file) return res.status(400).json({ msg: 'No image was provided' })

  try {
    const response = await axios.post('https://api.imgur.com/3/image', req.file.buffer.toString('base64'), {
      headers: {
        'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        'Content-Type': 'application/json',
      },
    })
    obj.photo = response.data.data.link;

    // saving the item
    try {
        const itemEdit = await Menu.findById(id)
        const {name, category, price, weight, cal, description, photo, available} = obj

        itemEdit.name = name
        itemEdit.category = category
        itemEdit.price = price
        itemEdit.weight = Number(weight)
        itemEdit.cal = Number(cal)
        itemEdit.photo = photo
        itemEdit.description = description
        itemEdit.available = Boolean(available)

        const saveItem = await itemEdit.save()

        res.status(201).json({msg: 'item saved'})

    } catch (error) {
        res.status(400).json({msg: 'item could be saved'})
    }

  } catch (error) {
    console.error('Error uploading image to Imgur:', error)
    res.status(500).json({ msg: 'Error uploading image to Imgur'})
  }
}

export{
    create,
    adminList,
    deleteItem,
    activeToggle,
    edit,
    editP,
}