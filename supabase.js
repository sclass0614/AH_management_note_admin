// Supabase API 키 및 URL 상수
const SUPABASE_URL = "https://dfomeijvzayyszisqflo.supabase.co";
const SUPABASE_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmb21laWp2emF5eXN6aXNxZmxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDg2NjA0MiwiZXhwIjoyMDYwNDQyMDQyfQ.K4VKm-nYlbODIEvO9P6vfKsvhLGQkY3Kgs-Fx36Ir-4"
//service rollkey사용해야함

function initSupabase() {
  // 이미 생성되어 있으면 재사용
  if (!window.supabase || !window.supabase.from) {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("✅ Supabase 클라이언트가 새로 생성되었습니다.");
  } else {
    console.log("🔄 Supabase 클라이언트를 재사용합니다.");
  }
  return window.supabase;
}
// 각 함수에서 initSupabase()를 호출하여 클라이언트를 가져옵니다

// 직원 정보를 가져오는 함수
async function getEmployeesInfo() {
  try {
    const supabase = initSupabase();
    const { data, error } = await supabase
      .from('employeesinfo')
      .select('직원번호, 직원명');
    
    if (error) {
      console.error('직원 정보 로드 에러:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('직원 정보 로드 중 예외 발생:', error);
    return [];
  }
}

// 특정 직원번호로 직원 정보를 가져오는 함수
async function getEmployeeByNumber(employeeNumber) {
  try {
    const supabase = initSupabase();
    console.log('직원번호로 직원 정보 조회:', employeeNumber);
    
    // 먼저 전체 데이터를 가져와서 클라이언트에서 필터링
    const { data: allEmployees, error } = await supabase
      .from('employeesinfo')
      .select('*');
    
    if (error) {
      console.error('직원 정보 조회 에러:', error);
      return null;
    }
    
    console.log('전체 직원 데이터:', allEmployees);
    
    if (allEmployees && allEmployees.length > 0) {
      // 대소문자 구분 없이 직원번호 매칭
      const matchedEmployee = allEmployees.find(emp => {
        if (!emp.직원번호) return false;
        
        const serverEmpNo = emp.직원번호;
        const searchEmpNo = employeeNumber;
        
        console.log(`비교: "${serverEmpNo}" vs "${searchEmpNo}"`);
        
        // 다양한 방법으로 매칭 시도
        const lowerMatch = serverEmpNo.toLowerCase() === searchEmpNo.toLowerCase();
        const exactMatch = serverEmpNo === searchEmpNo;
        const upperMatch = serverEmpNo.toUpperCase() === searchEmpNo.toUpperCase();
        const regexMatch = new RegExp(`^${searchEmpNo}$`, 'i').test(serverEmpNo);
        
        return lowerMatch || exactMatch || upperMatch || regexMatch;
      });
      
      console.log('매칭된 직원:', matchedEmployee);
      return matchedEmployee;
    }
    
    return null;
  } catch (error) {
    console.error('직원 정보 조회 중 예외 발생:', error);
    return null;
  }
}
