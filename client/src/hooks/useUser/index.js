import { useEffect, useState } from 'react'

const useUser = () => {
    return JSON.parse(localStorage.getItem("user"))
}

export default useUser