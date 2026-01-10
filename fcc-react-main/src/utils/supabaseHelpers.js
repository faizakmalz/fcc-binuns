import { supabase } from '../config/supabaseClient';

export const createStudentAccount = async (username, password, nim, nama) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password, nim, nama }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating student account:', error);
    return { success: false, error: error.message };
  }
};

export const loginUser = async (username, password) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (userError) throw userError;

    const { data: roleData, error: roleError } = await supabase
      .from('role_data')
      .select('*')
      .eq('user_id', userData.id)
      .single();

    const hasRole = !roleError && roleData ? true : false;

    return { 
      success: true, 
      data: {
        ...userData,
        hasRole,
        roleData: hasRole ? roleData : null 
      }
    };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserRole = async (userId, roleData) => {
  try {
    const { data, error } = await supabase
      .from('role_data')
      .insert([{
        user_id: userId,
        nim: roleData.nim,
        nama: roleData.nama,
        jurusan: roleData.jurusan,
        area: roleData.area,
        fakultas: roleData.fakultas,
        periode: roleData.periode,
        role: roleData.role,
        pembina_id: roleData.pembina,
      }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: error.message };
  }
};

export const getUserByUsername = async (username) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (userError) throw userError;

    const { data: roleData, error: roleError } = await supabase
      .from('role_data')
      .select('*')
      .eq('user_id', userData.id)
      .single();

    const hasRole = !roleError && roleData ? true : false;

    return { 
      success: true, 
      data: {
        ...userData,
        hasRole,
        roleData: hasRole ? roleData : null
      }
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: error.message };
  }
};

export const getAllStudentAccounts = async () => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const usersWithRole = await Promise.all(
      users.map(async (user) => {
        const { data: roleData, error: roleError } = await supabase
          .from('role_data')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const hasRole = !roleError && roleData ? true : false;
        return {
          ...user,
          hasRole,
          roleData: hasRole ? roleData : null
        };
      })
    );
    console.log("Fetched users with roles:", usersWithRole);

    return { success: true, data: usersWithRole };
  } catch (error) {
    console.error('Error fetching student accounts:', error);
    return { success: false, error: error.message };
  }
};

export const deleteStudentAccount = async (id, roleId) => {
  console.log("=== DEBUG deleteStudentAccount ===", id, roleId);
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (roleId !== null && roleId !== undefined) {
      const { error: roleDataError } = await supabase
      .from('role_data')
      .delete()
      .eq('id', roleId);
          if (roleDataError) throw roleDataError;
    } else {
      console.log("No roleId provided, skipping role_data deletion.");
    }

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting student account:', error);
    return { success: false, error: error.message };
  }
};
// ============ PEMBINA MANAGEMENT ============

export const createPembina = async (nama, binusianId, area, pic) => {
  try {
    const { data, error } = await supabase
      .from('pembina')
      .insert([{ nama, binusian_id: binusianId, area, pic }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating pembina:', error);
    return { success: false, error: error.message };
  }
};

export const getAllPembina = async () => {
  try {
    const { data, error } = await supabase
      .from('pembina')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching pembina:', error);
    return { success: false, error: error.message };
  }
};

export const getPembinaById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('pembina')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching pembina:', error);
    return { success: false, error: error.message };
  }
};

export const deletePembina = async (binusianId) => {
  try {
    const { error } = await supabase
      .from('pembina')
      .delete()
      .eq('binusian_id', binusianId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting pembina:', error);
    return { success: false, error: error.message };
  }
};

export const createRoleData = async (roleDataObj) => {
  try {
    const { data, error } = await supabase
      .from('role_data')
      .insert([roleDataObj])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating role data:', error);
    return { success: false, error: error.message };
  }
};

export const getRoleDataByType = async (role) => {
  try {
    const { data, error } = await supabase
      .from('role_data')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching role data:', error);
    return { success: false, error: error.message };
  }
};

export const deleteRoleData = async (nim) => {
  try {
    const { error } = await supabase
      .from('role_data')
      .delete()
      .eq('nim', nim);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting role data:', error);
    return { success: false, error: error.message };
  }
};

//SOUVENIR
export const updateSouvenirStatus = async (nim, status) => {
  try {
    const { data, error } = await supabase
      .from('role_data')
      .update({ souvenir: status })
      .eq('nim', nim)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating souvenir status:', error);
    return { success: false, error: error.message };
  }
};

//BUDDY
export const createBuddy = async (buddyObj) => {
  try {
    const { data, error } = await supabase
      .from('buddy')
      .insert([buddyObj])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating buddy:', error);
    return { success: false, error: error.message };
  }
};

export const getAllBuddy = async () => {
  try {
    const { data, error } = await supabase
      .from('buddy')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching buddy:', error);
    return { success: false, error: error.message };
  }
};

export const deleteBuddy = async (nim) => {
  try {
    const { error } = await supabase
      .from('buddy')
      .delete()
      .eq('nim', nim);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting buddy:', error);
    return { success: false, error: error.message };
  }
};

export const updateBuddy = async (buddyNim, updates) => {
  if (!buddyNim) {
    return { success: false, error: "Invalid buddy NIM" };
  }
  console.log("🔍 Updating buddy:", buddyNim, updates);
  try {
    const { data, error } = await supabase
      .from('buddy')
      .update(updates)
      .eq('nim', buddyNim)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating buddy:', error);
    return { success: false, error: error.message };
  }
};

export const getBuddyByPartnerNim = async (partnerNim) => {
  try {
    const { data, error } = await supabase
      .from('buddy')
      .select('*')
      .eq('partner_nim', partnerNim)
      .maybeSingle();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching buddy by partner NIM:', error);
    return { success: false, error: error.message };
  }
};

export const getUnassignedBuddies = async () => {
  try {
    const { data, error } = await supabase
      .from('buddy')
      .select('*')
      .is('partner_nim', null) 
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: data.filter(b => b.nim) };
  } catch (error) {
    console.error('Error fetching unassigned buddies:', error);
    return { success: false, error: error.message };
  }
};

export const getAllCounselors = async () => {
  try {
    const { data, error } = await supabase
      .from('role_data')
      .select('*')
      .eq('role', 'Peer Counselor')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching counselors:', error);
    return { success: false, error: error.message };
  }
};

export const getCounselorByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('role_data')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'Peer Counselor')
      .maybeSingle(); 
    if (error) throw error;
    if (!data) return { success: false, error: "Counselor not found" };

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching counselor by user ID:', error);
    return { success: false, error: error.message };
  }
};

export const updateCounselorData = async (id, updates) => {
  console.log("🔍 Updating counselor with ID:", id);
  console.log("🔍 Updates:", updates);
  
  try {
    const { data: checkData, error: checkError } = await supabase
      .from('role_data')
      .select('*')
      .eq('id', id);
    
    if (!checkData || checkData.length === 0) {
      return { success: false, error: `Data dengan ID ${id} tidak ditemukan` };
    }

    const { data, error } = await supabase
      .from('role_data')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { success: false, error: "Update gagal, data tidak berubah" };
    }

    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteCounselor = async (userId) => {
  try {
    const { error } = await supabase
      .from('role_data')
      .delete()
      .eq('user_id', userId)
      .eq('role', 'Peer Counselor');

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting counselor:', error);
    return { success: false, error: error.message };
  }
};

export const getCounselorStatistics = async () => {
  try {
    const { data, error, count } = await supabase
      .from('role_data')
      .select('*', { count: 'exact' })
      .eq('role', 'Peer Counselor');

    if (error) throw error;
    
    const activeCounselors = data?.filter(c => c.souvenir === false).length || 0;
    const completedCounselors = data?.filter(c => c.souvenir === true).length || 0;

    return {
      success: true,
      data: {
        total: count || 0,
        active: activeCounselors,
        completed: completedCounselors
      }
    };
  } catch (error) {
    console.error('Error fetching counselor statistics:', error);
    return { success: false, error: error.message };
  }
};

export const getCounselorsByArea = async (area) => {
  try {
    const { data, error } = await supabase
      .from('role_data')
      .select('*')
      .eq('role', 'Peer Counselor')
      .eq('area', area)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching counselors by area:', error);
    return { success: false, error: error.message };
  }
};

export const getCounselorsByPeriode = async (periode) => {
  try {
    const { data, error } = await supabase
      .from('role_data')
      .select('*')
      .eq('role', 'Peer Counselor')
      .eq('periode', periode)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching counselors by periode:', error);
    return { success: false, error: error.message };
  }
};

export const updatePartnerData = async (id, updates) => {
  console.log("🔍 Updating partner with ID:", id);
  console.log("🔍 Updates:", updates);
  
  try {
    const { data: checkData, error: checkError } = await supabase
      .from('role_data')
      .select('*')
      .eq('id', id)
      .eq('role', 'Peer Partner');
    
    console.log("✅ Check if exists:", checkData);
    
    if (!checkData || checkData.length === 0) {
      return { success: false, error: `Partner dengan ID ${id} tidak ditemukan` };
    }

    const { data, error } = await supabase
      .from('role_data')
      .update(updates)
      .eq('id', id)
      .eq('role', 'Peer Partner')
      .select();
      
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { success: false, error: "Update gagal" };
    }

    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updatePartnerBuddy = async (buddyNim, updates) => {
  
  try {
    const { data, error } = await supabase
      .from('buddy')
      .update(updates)
      .eq('nim', buddyNim)
      .select();
        
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { success: false, error: "Buddy tidak ditemukan" };
    }

    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get All Buddies
// export const getAllBuddy = async () => {
//   try {
//     const { data, error } = await supabase
//       .from('buddy')
//       .select('*')
//       .order('created_at', { ascending: false });

//     if (error) throw error;
//     return { success: true, data };
//   } catch (error) {
//     console.error('Error fetching buddies:', error);
//     return { success: false, error: error.message };
//   }
// };
export const getAllCreativeTeam = async () => {
  try {
    const { data, error } = await supabase
      .from('role_data')
      .select('*')
      .eq('role', 'Creative Team')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching creative team:', error);
    return { success: false, error: error.message };
  }
};

export const getCreativeTeamByNim = async (nim) => {
  try {
    const { data, error } = await supabase
      .from('role_data')
      .select('*')
      .eq('nim', nim)
      .eq('role', 'Creative Team')
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching creative team by NIM:', error);
    return { success: false, error: error.message };
  }
};

export const updateCreativeTeamData = async (nim, updates) => {
  try {
    const { data, error } = await supabase
      .from('role_data')
      .update(updates)
      .eq('nim', nim)
      .eq('role', 'Creative Team')
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] || data };
  } catch (error) {
    console.error('Error updating creative team:', error);
    return { success: false, error: error.message };
  }
};

export const deleteCreativeTeam = async (nim) => {
  try {
    const { error } = await supabase
      .from('role_data')
      .delete()
      .eq('nim', nim)
      .eq('role', 'Creative Team');

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting creative team:', error);
    return { success: false, error: error.message };
  }
};

export const getCreativeTeamStatistics = async () => {
  try {
    const { data, error, count } = await supabase
      .from('role_data')
      .select('*', { count: 'exact' })
      .eq('role', 'Creative Team');

    if (error) throw error;

    const activeCT = data?.filter(ct => ct.souvenir === false).length || 0;
    const completedCT = data?.filter(ct => ct.souvenir === true).length || 0;

    return {
      success: true,
      data: {
        total: count || 0,
        active: activeCT,
        completed: completedCT
      }
    };
  } catch (error) {
    console.error('Error fetching creative team statistics:', error);
    return { success: false, error: error.message };
  }
};

export const getCreativeTeamByArea = async (area) => {
  try {
    const { data, error } = await supabase
      .from('role_data')
      .select('*')
      .eq('role', 'Creative Team')
      .eq('area', area)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching creative team by area:', error);
    return { success: false, error: error.message };
  }
};

export const getCreativeTeamByPeriode = async (periode) => {
  try {
    const { data, error } = await supabase
      .from('role_data')
      .select('*')
      .eq('role', 'Creative Team')
      .eq('periode', periode)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching creative team by periode:', error);
    return { success: false, error: error.message };
  }
};

export const getBuddyForPartner = async (partnerNim) => {
  try {
    const { data, error } = await supabase
      .from('buddy')
      .select('*')
      .eq('partner_nim', partnerNim);

    if (error) throw error;
    return { success: true, data: data?.[0] || null };
  } catch (error) {
    console.error('Error fetching buddy for partner:', error);
    return { success: false, error: error.message };
  }
};

export const getAvailableBuddies = async () => {
  try {
    const { data, error } = await supabase
      .from('buddy')
      .select('*')
      .is('partner_nim', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching available buddies:', error);
    return { success: false, error: error.message };
  }
};

export const assignBuddyToPartner = async (buddyNim, partnerNim, partnerNama) => {
  try {
    const { data, error } = await supabase
      .from('buddy')
      .update({ 
        partner_nim: partnerNim, 
        partner_nama: partnerNama 
      })
      .eq('nim', buddyNim)
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] || data };
  } catch (error) {
    console.error('Error assigning buddy to partner:', error);
    return { success: false, error: error.message };
  }
};

export const unassignBuddyFromPartner = async (buddyNim) => {
  try {
    const { data, error } = await supabase
      .from('buddy')
      .update({ 
        partner_nim: null, 
        partner_nama: null 
      })
      .eq('nim', buddyNim)
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] || data };
  } catch (error) {
    console.error('Error unassigning buddy from partner:', error);
    return { success: false, error: error.message };
  }
};

export const reassignBuddy = async (buddyNim, newPartnerNim, newPartnerNama) => {
  try {
    const { data, error } = await supabase
      .from('buddy')
      .update({ 
        partner_nim: newPartnerNim, 
        partner_nama: newPartnerNama 
      })
      .eq('nim', buddyNim)
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] || data };
  } catch (error) {
    console.error('Error reassigning buddy:', error);
    return { success: false, error: error.message };
  }
};

export const createCounselorLogbook = async (logbookObj) => {
  try {
    const { data, error } = await supabase
      .from('counselor_data')
      .insert([logbookObj])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating counselor logbook:', error);
    return { success: false, error: error.message };
  }
};

export const updateCounselorLogbook = async (id, logbookObj) => {
  try {
    const { data, error } = await supabase
      .from('counselor_data')
      .update(logbookObj)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating counselor logbook:', error);
    return { success: false, error: error.message };
  }
};

export const getCounselorLogbookByUsername = async (username) => {
  try {
    const { data, error } = await supabase
      .from('counselor_data')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching counselor logbook:', error);
    return { success: false, error: error.message };
  }
};

export const getAllCounselorLogbook = async () => {
  try {
    const { data, error } = await supabase
      .from('counselor_data')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching all counselor logbook:', error);
    return { success: false, error: error.message };
  }
};

export const createPartnerLogbook = async (logbookObj) => {
  try {
    const { data, error } = await supabase
      .from('partner_data')
      .insert([logbookObj])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating partner logbook:', error);
    return { success: false, error: error.message };
  }
};

export const updatePartnerLogbook = async (id, logbookObj) => {
  try {
    const { data, error } = await supabase
      .from('partner_data')
      .update(logbookObj)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating partner logbook:', error);
    return { success: false, error: error.message };
  }
};

export const getPartnerLogbookByUsername = async (username) => {
  try {
    const { data, error } = await supabase
      .from('partner_data')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching partner logbook:', error);
    return { success: false, error: error.message };
  }
};

export const getAllPartnerLogbook = async () => {
  try {
    const { data, error } = await supabase
      .from('partner_data')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching all partner logbook:', error);
    return { success: false, error: error.message };
  }
};

// ============ CREATIVE TEAM LOGBOOK (Specific) ============

export const getAllCreativeLogbook = async () => {
  try {
    const { data, error } = await supabase
      .from('creative_data')
      .select('*')
      .order('created_at', { ascending: false });

    const pembinaData = data.map(async (entry) => {
      const { data: pembinaInfo, error: pembinaError } = await supabase
        .from('pembina')
        .select('nama')
        .eq('id', entry.pembina)
        .single();
      if (pembinaError) {
        console.error('Error fetching pembina info:', pembinaError);
        return { ...entry, pembina_nama: null };
      }
      return { ...entry, pembina_nama: pembinaInfo.nama };
    });

    const dataWithPembina = await Promise.all(pembinaData);

    if (error) throw error;
    return { success: true, data: dataWithPembina };
  } catch (error) {
    console.error('Error fetching all partner logbook:', error);
    return { success: false, error: error.message };
  }
};

// Get Creative Logbook by User ID
export const getCreativeLogbookByUsername = async (username) => {
  try {
    const { data, error } = await supabase
      .from('creative_data')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching creative logbook by user ID:', error);
    return { success: false, error: error.message };
  }
};

export const getCreativeLogbookFiltered = async (username, periode = null, pembina = null) => {
  try {
    let query = supabase
      .from('creative_data')
      .select('*')
      .eq('username', username);
    
    if (periode) query = query.eq('periode', periode);
    if (pembina) query = query.eq('pembina', pembina);
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching filtered creative logbook:', error);
    return { success: false, error: error.message };
  }
};

// Update Creative Team Logbook
export const updateCreativeLogbook = async (id, logbookObj) => {
  try {
    const { data, error } = await supabase
      .from('creative_data')
      .update(logbookObj)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating creative logbook:', error);
    return { success: false, error: error.message };
  }
};

export const saveCreativeLogbook = async (logbookData) => {
  try {
    const { data, error } = await supabase
        .from('creative_data')
        .insert([logbookData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data, isUpdate: false };
  } catch (error) {
    console.error('Error saving creative logbook:', error);
    return { success: false, error: error.message };
  }
};

// Delete Creative Logbook
export const deleteCreativeLogbookEntry = async (id) => {
  try {
    const { error } = await supabase
      .from('creative_data')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting creative logbook:', error);
    return { success: false, error: error.message };
  }
};


export const getSouvenirRoleData = async () => {
  try {
    const { data, error } = await supabase
      .from('role_data')
      .select('id, user_id, nim, nama, jurusan, area, fakultas, periode, role, souvenir')
      .in('role', ['Peer Counselor', 'Peer Partner', 'Creative Team'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching souvenir role data:', error);
    return { success: false, error: error.message };
  }
};

export const updateSouvenirStatusById = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('role_data')
      .update({ souvenir: status })
      .eq('id', id)
      .select('id, souvenir')
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating souvenir status by id:', error);
    return { success: false, error: error.message };
  }
};


export const createEvaluation = async (role, title, link) => {
  try {
    const { data, error } = await supabase
      .from('evaluations')
      .insert([{ role, title, link }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating evaluation:', error);
    return { success: false, error: error.message };
  }
};

export const getEvaluationsByRole = async (role) => {
  try {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return { success: false, error: error.message };
  }
};

export const updateEvaluation = async (id, title, link, role) => {
  try {
    const { data, error } = await supabase
      .from('evaluations')
      .update({ title, link, role })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating evaluation:', error);
    return { success: false, error: error.message };
  }
};

export const deleteEvaluation = async (id) => {
  try {
    const { error } = await supabase
      .from('evaluations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    return { success: false, error: error.message };
  }
};

export const createQuestionnaire = async (role, title, link) => {
  try {
    const { data, error } = await supabase
      .from('questionnaires')
      .insert([{ role, title, link }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating questionnaire:', error);
    return { success: false, error: error.message };
  }
};

export const getQuestionnairesByRole = async (role) => {
  try {
    const { data, error } = await supabase
      .from('questionnaires')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching questionnaires:', error);
    return { success: false, error: error.message };
  }
};

export const updateQuestionnaire = async (id, title, link, role) => {
  try {
    const { data, error } = await supabase
      .from('questionnaires')
      .update({ title, link, role })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating questionnaire:', error);
    return { success: false, error: error.message };
  }
};

export const deleteQuestionnaire = async (id) => {
  try {
    const { error } = await supabase
      .from('questionnaires')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting questionnaire:', error);
    return { success: false, error: error.message };
  }
};