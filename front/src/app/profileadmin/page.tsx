import React from 'react';
import PerfilAdmin from '@/components/ProfileAdmin/ProfileAdmincomponent';
import ProductForm from '@/components/Adminproduct/AdminProduct';
import AdminRoleAssigner from '@/components/Adminproduct/AdminRoles';

const ProfileAdmin = () => {
    return(
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-purple-800 to-black py-8 px-4">
        <PerfilAdmin />
        <ProductForm />
        <AdminRoleAssigner />

    </div>
    )
}

export default ProfileAdmin