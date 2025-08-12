function changeMenuSelected(newSelected, event) {
  oldSelected = document.querySelector(".menu-selected")
  if(oldSelected){
    oldSelected.classList.remove('border-2', 'border-white', 'menu-selected')
    oldSelected.children[2].style.maxHeight = 0
  }
  if(event.target.tagName !== 'BUTTON' && oldSelected === newSelected){return}

  newSelected.classList.add('border-2', 'border-white', 'menu-selected')
  const detail = newSelected.children[2]
  detail.style.maxHeight = detail.scrollHeight + "px"
}

const template = document.getElementById('template-node')
const menuList = document.getElementById("menu-list")
menuList.children[0].onclick = () => {changeMenuSelected(menuList.children[0], event)}
menuList.children[1].onclick = () => {changeMenuSelected(menuList.children[1], event)}
const priceMenu1 = document.getElementById('price-1')
priceMenu1.dataset.basePrice = 80
priceMenu1.dataset.extraPrice1 = false
priceMenu1.dataset.extraPrice2 = false
function changePrice(event){
    changeExtraSelected(event.target)

    const parentSelfIndex = parseInt(event.target.parentElement.dataset.selfIndex)
    const selfIndex = parseInt(event.target.dataset.selfIndex) 

    if(parentSelfIndex === 0){
        menuList.children[0].dataset['extra' + (parentSelfIndex+4)] = event.target.textContent
        if(selfIndex === 0) priceMenu1.dataset.extraPrice1 = false
        else priceMenu1.dataset.extraPrice1 = true

        priceMenu1.classList.add('text-red-500')
        setTimeout(() => {priceMenu1.classList.remove('text-red-500')}, 300);
    } else if(parentSelfIndex === 1){
        menuList.children[0].dataset['extra' + (parentSelfIndex+4)] = event.target.textContent
        if(selfIndex < 3) priceMenu1.dataset.extraPrice2 = false
        else priceMenu1.dataset.extraPrice2 = true

        priceMenu1.classList.add('text-red-500')
        setTimeout(() => {priceMenu1.classList.remove('text-red-500')}, 300);
    } else {
        menuList.children[0].dataset['extra' + (parentSelfIndex+4)] = event.target.textContent
    }

    const finalPrice = parseInt(priceMenu1.dataset.basePrice) + (priceMenu1.dataset.extraPrice1 === "true"? 10:0) + (priceMenu1.dataset.extraPrice2 === "true"? 5:0)
    priceMenu1.textContent = 'harga: ' + finalPrice + 'k'
    menuList.children[0].dataset.price = finalPrice
}







function changeExtraSelected(el){
    const parent = el.parentElement
    const oldSelected = parent.querySelector(".selected")
    oldSelected.classList.remove('bg-green-500/50', 'selected')

    el.classList.add('bg-green-500/50', 'selected')
}



const cartItemList = document.getElementById("cart-item-list")
const cartItemListNode = template.content.getElementById('cart-item-list-node')
const cartNotif = document.getElementById("cart-notification")
const totalPrice = document.getElementById('total-price')
function addOrder(element){
  const parent = element.parentElement
  const rootParent = parent.parentElement
  const itemDetail = parent.children[0].children

  const newItem = cartItemListNode.cloneNode(true)
  newItem.classList.remove('hidden')
  const children = newItem.children[0].children

  let itemSelectedData = parent.id + "--" + itemDetail[0].textContent.split(' ')[1] + "--"
  children[1].textContent = rootParent.dataset['name']
  children[2].textContent = rootParent.dataset['price']
  totalPrice.textContent = parseInt(totalPrice.textContent) + parseInt(rootParent.dataset['price']) + 'k'

  const extraDetailNode = children[3]
  for(i=4;i<rootParent.dataset.extraLength;i++){
    const newDetail = extraDetailNode.cloneNode()
    newDetail.classList.remove('hidden')


    newDetail.textContent = rootParent.dataset['extra' + i]
    itemSelectedData += (rootParent.dataset['extra' + i] + '--')

    newItem.children[0].appendChild(newDetail)
  }

  const existItemList = document.getElementById(itemSelectedData)
  if(existItemList){
    existItemList.children[0].children[0].textContent = parseInt(existItemList.dataset.orderCount) + 1
    existItemList.dataset.orderCount = parseInt(existItemList.dataset.orderCount) + 1

    cartNotif.parentElement.classList.remove('hidden')
    cartNotif.textContent = (parseInt(cartNotif.textContent) + 1) + ' baru!'
    return
  }  

  newItem.id = itemSelectedData
  newItem.dataset.orderCount = 1
  cartItemList.appendChild(newItem)

  const hr = document.createElement('hr')
  cartItemList.appendChild(hr)

  cartNotif.parentElement.classList.remove('hidden')
  cartNotif.textContent = (parseInt(cartNotif.textContent) + 1) + ' baru!'
}

function removeItem(el){
  const parent = el.parentElement
  removedPrice = parseInt(parent.children[0].children[2].textContent)
  totalPrice.textContent = parseInt(totalPrice.textContent) - removedPrice + 'k'

  parent.dataset.orderCount = parseInt(parent.dataset.orderCount) -1
  if(parseInt(parent.dataset.orderCount) === 0){
    parent.nextElementSibling.remove()
    parent.remove()
    return
  }

  parent.children[0].children[0].textContent = parent.dataset.orderCount
}

function contactWA(number, person){
    const linkWa = 'https://wa.me/' + number + '?text=' + 'permisi%20kak%20' + person + '...%0A'
    window.open(linkWa, '_blank')
}

const shoppingCart = document.getElementById("shopping-cart")
const main = document.getElementById("page-main")
const footer = document.getElementById('page-footer')
function toggleCart(){
  if(main.classList.contains('hidden')){
    main.classList.remove("hidden")
    footer.classList.remove('hidden')
    shoppingCart.classList.add("hidden")
    menuList.scrollIntoView()
    window.scrollBy(0,-120)
    return
  }

  main.classList.add("hidden")
  footer.classList.add('hidden')
  shoppingCart.classList.remove("hidden")
  cartNotif.parentElement.classList.add('hidden')
  cartNotif.textContent = 0
}



function makeOrder(){
  const allOrderNode = cartItemList.children
  if(allOrderNode.length === 0){return}

  let allOrderData = []
  let allPriceData = []

  for(i=0; i<allOrderNode.length; i+=2){
    current = allOrderNode[i]
    allOrderData.push(
      (current.dataset.orderCount)
      + ' ' + (current.children[0].children[1].textContent)
      + ' ' + (current.id.split('--').slice(2)).join(' ')
    )
    allPriceData.push(current.children[0].children[2].textContent)
  }

  allOrderData = allOrderData.join('\n')


  const prefilledGform = 'https://docs.google.com/forms/d/e/1FAIpQLScwbg_n5z9eGDzwIV-oKh8OJ0-alwtTmQ9VxCc-XtULUAQwcw/viewform?usp=pp_url&entry.1817648879=orderList&entry.18990555=totalPrice'
  let newPrefilledGform = ''
  const startIndex = prefilledGform.indexOf("entry.")

  const firstEntryStartIndex = prefilledGform.indexOf('=', startIndex)
  const firstEntryEndIndex = prefilledGform.indexOf('&entry', startIndex)
  const secondEntryStartIndex = prefilledGform.indexOf('=', firstEntryEndIndex)

  newPrefilledGform = prefilledGform.slice(0, secondEntryStartIndex+1) + totalPrice.textContent // + data.prefilledGform.slice(secondEntryEndIndex, data.prefilledGform.length)
  newPrefilledGform = newPrefilledGform.slice(0, firstEntryStartIndex+1) + encodeURIComponent(allOrderData)  + newPrefilledGform.slice(firstEntryEndIndex, prefilledGform.length)

  window.location.href = newPrefilledGform
}