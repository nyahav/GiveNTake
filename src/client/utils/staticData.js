import { LuPlane } from 'react-icons/lu'
import { TbBrandStackoverflow } from 'react-icons/tb'
import { PiStarOfDavidBold } from 'react-icons/pi'
import { MdPets } from 'react-icons/md'
import { FaScrewdriverWrench } from 'react-icons/fa6'
import { FaPeopleCarry } from 'react-icons/fa'
import { ImBooks } from 'react-icons/im'
import { MdElderly } from 'react-icons/md'
import { GiConsoleController } from 'react-icons/gi'
import { FaComputer } from 'react-icons/fa6'

import StrongerTogetherImg from '../assets/images/categories_grid/category-stronger-together.jpeg'
import PetCareImg from '../assets/images/categories_grid/category-pet-care.avif'
import BooksImg from '../assets/images/categories_grid/category-books.jpeg'
import GamingImg from '../assets/images/categories_grid/category-gaming.jpeg'
import ElectronicImg from '../assets/images/categories_grid/category-electronic.jpeg'
import Elderly from '../assets/images/categories_grid/elderly.jpg'
import Home from '../assets/images/categories_grid/home_fix.jpg'
import Moving from '../assets/images/categories_grid/moving.jpg'
import Travel from '../assets/images/categories_grid/travel.jpg'

// I am just a lazy person and need to get this data from server.
export const CATEGORIES = {
  // 'ROAD_ASSISTANCE': { name: 'Road Assistance', obj: Car, to: '/feed/road-assistance', icon: FaCarOn },
  ALL_CATEGORIES: { name: 'All Categories', icon: TbBrandStackoverflow },
  STRONGER_TOGETHER: { name: 'Stronger Together', obj: StrongerTogetherImg, icon: PiStarOfDavidBold },
  PET_CARE: { name: 'Pet Care', obj: PetCareImg, icon: MdPets },
  HOME_REPAIR: { name: 'Home Repair', obj: Home, icon: FaScrewdriverWrench },
  MOVING: { name: 'Moving', obj: Moving, icon: FaPeopleCarry },
  BOOKS_SCHOOL: { name: 'Books', obj: BooksImg, icon: ImBooks },
  ELDERLY_CARE: { name: 'Elderly Care', obj: Elderly, icon: MdElderly },
  GAMING: { name: 'Gaming', obj: GamingImg, icon: GiConsoleController },
  ELECTRONIC: { name: 'Electronic', obj: ElectronicImg, icon: FaComputer },
  TRAVEL: { name: 'Travel', obj: Travel, icon: LuPlane }
}

// I am just a lazy person and need to get this data from server.
export const REPORTS_REASONS = {
  SPAM: 'Spam',
  INAPPROPRIATE_CONTENT: 'Inappropriate content',
  OFFENSIVE_LANGUAGE: 'Offensive language',
  COPYRIGHT_VIOLATION: 'Copyright violation',
  FALSE_INFORMATION: 'False information',
  PERSONAL_ATTACK: 'Personal attack',
  OTHER: 'Other reason (please specify)'
}

export const RADIUS_LIST = [3, 10, 30, 60, 100]

export const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150
}
