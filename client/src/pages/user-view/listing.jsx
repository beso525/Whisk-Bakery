import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ProductFilter from "@/components/user-view/filter";
import ProductDetailsDialog from "@/components/user-view/product-details";
import UserProductTile from "@/components/user-view/product-tile";
import { sortOptions } from "@/config";
import { addToCart, getCart } from "@/store/shop/carts-slice";
import { displayProductDetails, displayFilteredProducts, setProductDetails } from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(',')

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
    }
  }
  return queryParams.join('&');
}

function UserListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(state => state.shoppingProducts)
  const { user } = useSelector(state => state.auth)
  const [filters, setFilters] = useState(JSON.parse(sessionStorage.getItem("filters")) || {});
  const [sort, setSort] = useState("price-lowhigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { cartItems } = useSelector(state => state.shoppingCart)

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let copiedFilters = { ...filters };
    const indexOfCurrectSection = Object.keys(copiedFilters).indexOf(getSectionId);

    if (indexOfCurrectSection === -1) {
      copiedFilters = {
        ...copiedFilters,
        [getSectionId]: [getCurrentOption]
      }
    } else {
      const indexOfCurrentOption = copiedFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1) {
        copiedFilters[getSectionId].push(getCurrentOption);

      } else {
        copiedFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }

    }
    setFilters(copiedFilters);
    sessionStorage.setItem("filters", JSON.stringify(copiedFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(displayProductDetails(getCurrentProductId))
    setOpenDetailsDialog(true)
  }

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
          dispatch(getCart())
          toast.success("Item added to cart")
        }
      })
  }

  useEffect(() => {
    dispatch(setProductDetails())
  }, [dispatch])

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters)
      setSearchParams(new URLSearchParams(createQueryString))
    }
  }, [filters, setSearchParams])

  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(displayFilteredProducts({ filterParams: filters, sortParams: sort }));
    }
  }, [dispatch, sort, filters])


  return <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
    <ProductFilter filters={filters} handleFilter={handleFilter} />
    <div className="bg-background w-full rounded-lg ">
      <div className="p-4 border-b flex  items-center justify-between">
        <h2 className="text-lg font-extrabold">All Products</h2>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">
            {productList.length} Products
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ArrowUpDownIcon className="h-4 w-4" />
                <span className="cursor-pointer">Sort by</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                {
                  sortOptions.map(sortItem => <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                    {sortItem.label}
                  </DropdownMenuRadioItem>)
                }
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {
          productList && productList.length > 0 ?
            productList.map(productItem =>
              <UserProductTile
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                handleAddToCart={handleAddToCart}
              />) : null
        }
      </div>
    </div>
    <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
  </div>

}

export default UserListing;