import { ChefHat, LogOut, ShoppingCart, UserCog, ChevronsDown } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SheetTrigger, Sheet, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { userHeaderMenu } from "@/config";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import CartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { getCart } from "@/store/shop/carts-slice";
import { Label } from "../ui/label";



function MenuItems() {

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(currentMenuId) {
    const currentSelection =
      currentMenuId.id !== 'products' && currentMenuId.id !== 'search' ?
        {
          category: [currentMenuId.id]
        } : null

    location.pathname.includes('listing') && currentSelection !== null ?
      setSearchParams(new URLSearchParams(`?category=${currentMenuId.id}`))
      : navigate(currentMenuId.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {
        userHeaderMenu.map((menuItem) => (
          <Label
            onClick={() => handleNavigate(menuItem)}
            key={menuItem.id}
            className="cursor-pointer hover:scale-102 transition duration-100 font-medium"
          >
            {menuItem.label}
          </Label>
        ))
      }
    </nav>
  )
}

// Right side of header options
function DetailsHeader() {
  const { user } = useSelector(state => state.auth);
  const { cartItems } = useSelector(state => state.shoppingCart)
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(getCart())
    }
  }, [dispatch, user]);

  return <div className="flex lg:items-center text-black text-lg flex-row gap-4">
    <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
      <Button variant="outline" className="cursor-pointer" size="icon" onClick={() => setOpenCartSheet(true)}>
        <ShoppingCart className="w-6 h-6" />
        <span className="sr-only">Cart</span>
      </Button>
      <CartWrapper
        setOpenCartSheet={setOpenCartSheet}
        cartItems={
          cartItems && cartItems.items && cartItems.items.length > 0 ?
            cartItems.items
            : null}
      />
    </Sheet>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className={"bg-black cursor-pointer"}>
          <AvatarFallback className="bg-black text-white font-extrabold">
            {user?.username[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="w-64 mt-3 mr-1">
        <DropdownMenuLabel>
          Logged in as {user?.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/shop/account")}>
          <UserCog className="h-4 w-4 mr-2" />
          Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleLogout()}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div >
}

function UserHeader() {
  const location = useLocation();
  const isHomePage = location.pathname === "/shop/home";

  return (
    <header className={`w-full z-50 text-[20px] ${isHomePage ? "text-white absolute rounded-b-4xl top-0 bg-amber-800/70" : "text-black relative bg-white"}`}>
      <div className="flex h-20 items-center justify-between px-4 md:px-6">
        <Link className="flex items-center p-2 px-4 gap-2" to="/shop/home">
          <ChefHat className="h-7 w-7 " />
          <span className="font-bold">Whisk</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="none" className="text-white hover:scale-125 cursor-pointer lg:hidden">
              <ChevronsDown className="size-[32px]" />
              <span className="sr-only">Toggle header</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full items-center max-w-xs p-6 flex flex-col ">
            <Link className="flex justify-center p-2 px-4 w-full gap-2 border-b" to="/shop/home">
              <ChefHat className="h-7 w-7 " />
              <span className="font-bold">Whisk</span>
            </Link>
            <MenuItems />
            <DetailsHeader className="flex justify-center" />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <DetailsHeader />
        </div>
      </div>
    </header >
  );
}

export default UserHeader;