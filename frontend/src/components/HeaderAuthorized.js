import { Link } from 'react-router-dom'
import {
  FaCog,
  FaFileContract,
  FaFileMedical,
  FaMicroscope,
  FaUser,
  FaUserCircle,
  FaUserInjured,
  FaUsers,
} from 'react-icons/fa'

const HeaderAuthorized = () => {
  // const userLogin = useSelector((state) => state.userLogin)
  // const { userInfo } = userLogin

  const userInfo =
    localStorage.getItem('userInfo') &&
    JSON.parse(localStorage.getItem('userInfo'))

  return (
    <>
      <nav className='sticky-top' id='sidebar'>
        <div className='container-fluid pt-3'>
          <Link to='/' className='navbar-brand fw-bold fs-6'>
            Hospital Name
          </Link>
          <ul
            className='navbar-nav text-light d-flex justify-content-between'
            style={{ height: 'calc(100vh - 100px)' }}
          >
            <div>
              <li className='nav-item'>
                <Link to='/patient' className='nav-link'>
                  <FaUserInjured className='mb-1' /> Patients
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/history' className='nav-link'>
                  <FaFileMedical className='mb-1' /> History
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/lab-request' className='nav-link'>
                  <FaMicroscope className='mb-1' /> Lab Request
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/laboratory' className='nav-link'>
                  <FaMicroscope className='mb-1' /> Laboratory
                </Link>
              </li>
            </div>

            <div>
              <li className='nav-item dropdown'>
                <span
                  className='nav-link dropdown-toggle'
                  id='navbarDropdown'
                  role='button'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  <FaUserCircle className='mb-1' /> {userInfo && userInfo.name}
                </span>
                <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
                  <li>
                    <Link to='/profile' className='dropdown-item'>
                      <FaUser className='mb-1' /> Profile
                    </Link>
                  </li>
                </ul>
              </li>

              {userInfo && userInfo.roles.includes('Admin') && (
                <>
                  <li className='nav-item dropdown '>
                    <span
                      className='nav-link dropdown-toggle'
                      id='navbarDropdown'
                      role='button'
                      data-bs-toggle='dropdown'
                      aria-expanded='false'
                    >
                      <FaCog className='mb-1' /> Admin
                    </span>
                    <ul
                      className='dropdown-menu '
                      aria-labelledby='navbarDropdown'
                    >
                      <li>
                        <Link to='/admin/users' className='dropdown-item'>
                          <FaUsers className='mb-1' /> Users
                        </Link>
                      </li>
                      <li>
                        <Link to='/admin/users/logs' className='dropdown-item'>
                          <FaFileContract className='mb-1' /> Users Log
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </div>
          </ul>
        </div>
      </nav>
    </>
  )
}

export default HeaderAuthorized
