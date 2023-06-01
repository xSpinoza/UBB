import Menu from "../MongoDB/models/menu.js"

const menu = async (req, res) => {
    const {category} = req.params
    const param = category.toLowerCase()
  
    try {
      const getMenu = await Menu.find({category: param, available: true}).select('-date -__v')
      res.json({menu: getMenu})
      
    } catch (error) {
      console.log(error)
      res.json({msg: 'error'})
    }
}

export{
    menu
}