import { useEffect, useState } from "react";
import CommonForms from "../common/CommonForms";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addAddress, deleteAddress, editAddress, getAddress } from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { toast } from "sonner";

const initialAddressFormData = {
  address: '',
  city: '',
  postalcode: '',
  phone: '',
  notes: ''
}

function Address({ setCurrentSelectedAddress, selectedId }) {

  const [formData, setFormData] = useState(initialAddressFormData)
  const [currentEditId, setCurrentEditId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { addressList } = useSelector(state => state.shopAddress)

  function isFormValid() {
    const optional = "notes";

    return Object.keys(formData)
      .filter((key) => key !== optional)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  function handleAddress(e) {
    e.preventDefault();

    if (addressList.length >= 3 && currentEditId === null) {
      toast.warning("You can only have up to 3 addresses at a time.")
      setFormData(initialAddressFormData);
    } else {
      currentEditId !== null ?
        dispatch(editAddress({
          addressId: currentEditId,
          formData
        }))
          .then(data => {
            if (data?.payload?.success) {
              dispatch(getAddress(user?.id))
              setCurrentEditId(null)
              setFormData(initialAddressFormData)
              toast.success("Address edited.")
            }
          }) :
        dispatch(addAddress({
          ...formData
        }))
          .then(data => {
            if (data?.payload?.success) {
              dispatch(getAddress(user?.id))
              setFormData(initialAddressFormData)
              toast.success("Address added.")
            }
          })
    }
  }

  function handleDeleteAddress(getCurrentAddressId) {
    dispatch(deleteAddress({
      addressId: getCurrentAddressId._id
    })).then(data => {
      if (data?.payload?.success) {
        dispatch(getAddress(user?.id))
        toast.success("Address deleted.")
      }
    })
  }

  function handleEditAddress(getCurrentAddressId) {
    setCurrentEditId(getCurrentAddressId?._id)
    setFormData({
      ...formData,
      address: getCurrentAddressId?.address,
      city: getCurrentAddressId?.city,
      postalcode: getCurrentAddressId?.postalcode,
      phone: getCurrentAddressId?.phone,
      notes: getCurrentAddressId?.notes
    })
  }

  useEffect(() => {
    dispatch(getAddress(user?.id))
  }, [dispatch, user])


  return <Card>
    <div className="font-bold text-2xl">Address List</div>
    <div className="mb-5 gap-5 p-3 grid font-[noto-sans] grid-cols-1 sm:grid-cols-2">
      {
        addressList && addressList.length > 0 ?
          addressList.map(address =>
            <AddressCard
              selectedId={selectedId}
              addressInfo={address}
              handleDeleteAddress={handleDeleteAddress}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          )
          : null
      }

    </div>
    <CardHeader>
      <CardTitle>
        {
          currentEditId !== null ? 'Edit Address' : 'Add Address'
        }
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <CommonForms
        formControls={addressFormControls}
        formData={formData}
        setFormData={setFormData}
        buttonText={currentEditId !== null ? 'Edit' : 'Add'}
        onSubmit={handleAddress}
        isBtnDisabled={!isFormValid()}
      />
    </CardContent>
  </Card>
}

export default Address;