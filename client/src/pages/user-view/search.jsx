import { Input } from "@/components/ui/input";
import ProductDetailsDialog from "@/components/user-view/product-details";
import UserProductTile from "@/components/user-view/product-tile";
import { addToCart, getCart } from "@/store/shop/carts-slice";
import { displayProductDetails } from "@/store/shop/products-slice";
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

function Search() {

  const [keyword, setKeyword] = useState('');
  const [searchParams, setSearchParams] = useSearchParams()
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const { searchResults } = useSelector(state => state.shopSearch)
  const { cartItems } = useSelector(state => state.shoppingCart)
  const { user } = useSelector(state => state.auth)
  const { productDetails } = useSelector(state => state.shoppingProducts)
  const dispatch = useDispatch();

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true)
    }
  }, [productDetails])

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];
    if (!user?.id) {
      toast.error("Please log in to add items to cart.");
      return;
    }
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === getCurrentProductId)
      if (indexOfCurrentItem > -1) {
        const getQty = getCartItems[indexOfCurrentItem].quantity;
        if (getQty + 1 > getTotalStock) {
          toast.error(`Only ${getQty} available`)
          return;
        }
      }
    }

    dispatch(addToCart({
      productId: getCurrentProductId, quantity: 1
    }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(getCart(user?.id))
          toast.success("Item added to cart")
        }
      })
  }

  useEffect(() => {
    if (keyword && keyword.trim() !== '' && keyword.trim().length > 3) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
        dispatch(getSearchResults(keyword))
      }, 100)
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword, dispatch, setSearchParams])

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(displayProductDetails(getCurrentProductId))
  }


  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6"
            placeholder="Search products"
          />
        </div>
      </div>
      {
        !searchResults.length && keyword.length > 3 ?
          <h1 className="text-3xl font-bold">No results found</h1> :
          keyword.length <= 3 ?
            <h1 className="text-3xl font-bold">What are you craving?</h1> :
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {
                searchResults.map(item =>
                  <UserProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddToCart={handleAddToCart}
                    product={item} />)
              }
            </div>
      }
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails} />
    </div>
  )
}

export default Search;