"use client";

import React, { useState } from "react";
import { toggleProductVisibility } from "@/utils/product.helper";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";


interface ToggleProductVisibilityButtonProps {
    productId: string;
    isActive: boolean;
    token: string;
    onToggle?: () => void; 
}

const ToggleProductVisibilityButton: React.FC<ToggleProductVisibilityButtonProps> = ({
    productId,
    isActive,
    token,
    onToggle,
}) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        try {
            setLoading(true);
            const success = await toggleProductVisibility(productId, !isActive, token);
            if (!success) throw new Error("No se pudo actualizar el estado");

            Swal.fire({
                icon: "success",
                title: `Producto ${isActive ? "desactivado" : "activado"}`,
                showConfirmButton: false,
                timer: 1800,
            });

            onToggle?.(); // Llama a función externa si se proporciona
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema actualizando la visibilidad del producto.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition ${isActive
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {isActive ? <EyeOff size={18} /> : <Eye size={18} />}
            {isActive ? "Ocultar producto" : "Mostrar producto"}
        </button>
    );
};

export default ToggleProductVisibilityButton;