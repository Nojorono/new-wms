import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDownIcon, HorizontaLDots } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useDynamicSidebarItems } from "./useDynamicSidebarItems";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { menuItems, settingsItems } = useDynamicSidebarItems();

  const [openMainSubmenu, setOpenMainSubmenu] = useState<number | null>(null);
  const [openSettingsSubmenu, setOpenSettingsSubmenu] = useState<number | null>(
    null
  );
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    menuItems.forEach((nav, index) => {
      nav.subItems?.forEach((sub) => {
        if (isActive(sub.path)) {
          setOpenMainSubmenu(index);
        }
      });
    });
    settingsItems.forEach((nav, index) => {
      nav.subItems?.forEach((sub) => {
        if (isActive(sub.path)) {
          setOpenSettingsSubmenu(index);
        }
      });
    });
  }, [location.pathname, isActive, menuItems, settingsItems]);

  useEffect(() => {
    const refs = [
      ...(openMainSubmenu !== null ? [`main-${openMainSubmenu}`] : []),
      ...(openSettingsSubmenu !== null
        ? [`settings-${openSettingsSubmenu}`]
        : []),
    ];

    refs.forEach((key) => {
      const el = subMenuRefs.current[key];
      if (el) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: el.scrollHeight,
        }));
      }
    });
  }, [openMainSubmenu, openSettingsSubmenu]);

  const handleSubmenuToggle = (type: "main" | "settings", index: number) => {
    if (type === "main") {
      setOpenMainSubmenu((prev) => (prev === index ? null : index));
    } else {
      setOpenSettingsSubmenu((prev) => (prev === index ? null : index));
    }
  };

  const renderSection = (
    items: typeof menuItems,
    type: "main" | "settings",
    title: string
  ) => (
    <div>
      <h2
        className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        {isExpanded || isHovered || isMobileOpen ? (
          title
        ) : (
          <HorizontaLDots className="size-6" />
        )}
      </h2>
      <ul className="flex flex-col gap-4">
        {items.map((nav, index) => {
          const isOpen =
            type === "main"
              ? openMainSubmenu === index
              : openSettingsSubmenu === index;
          const key = `${type}-${index}`;
          return (
            <li key={nav.name}>
              {nav.subItems ? (
                <button
                  onClick={() => handleSubmenuToggle(type, index)}
                  className={`menu-item group ${
                    isOpen ? "menu-item-active" : "menu-item-inactive"
                  } ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "lg:justify-start"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isOpen
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <ChevronDownIcon
                      className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-brand-500" : ""
                      }`}
                    />
                  )}
                </button>
              ) : (
                nav.path && (
                  <Link
                    to={nav.path}
                    className={`menu-item group ${
                      isActive(nav.path)
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    }`}
                  >
                    <span
                      className={`menu-item-icon-size ${
                        isActive(nav.path)
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                      }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">{nav.name}</span>
                    )}
                  </Link>
                )
              )}
              {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[key] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height: isOpen ? `${subMenuHeight[key] || 0}px` : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems.map((sub) => (
                      <li key={sub.name}>
                        <Link
                          to={sub.path}
                          className={`menu-dropdown-item ${
                            isActive(sub.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${
        isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"
      } ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Section */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo_nna.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      {/* Main + Settings */}
      <div className="flex flex-col justify-between flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6 flex flex-col flex-grow">
          <div className="flex flex-col gap-8 flex-grow">
            {renderSection(menuItems, "main", "Menu")}
          </div>
          {settingsItems.length > 0 && (
            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800">
              {renderSection(settingsItems, "settings", "Settings")}
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;

// // components/AppSidebar.tsx
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { Link, useLocation } from "react-router";
// import { ChevronDownIcon, HorizontaLDots } from "../icons";
// import { useSidebar } from "../context/SidebarContext";
// import { useDynamicSidebarItems } from "./useDynamicSidebarItems";
// import { FaCog } from "react-icons/fa";

// const AppSidebar: React.FC = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const location = useLocation();
//   const navItems = useDynamicSidebarItems();

//   const [openSubmenu, setOpenSubmenu] = useState<{
//     type: "main";
//     index: number;
//   } | null>(null);
//   const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
//     {}
//   );
//   const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

//   const isActive = useCallback(
//     (path: string) => location.pathname === path,
//     [location.pathname]
//   );

//   useEffect(() => {
//     let matched = false;
//     navItems.forEach((nav, index) => {
//       if (nav.subItems) {
//         nav.subItems.forEach((sub) => {
//           if (isActive(sub.path)) {
//             setOpenSubmenu({ type: "main", index });
//             matched = true;
//           }
//         });
//       }
//     });
//     if (!matched) setOpenSubmenu(null);
//   }, [location, isActive, navItems]);

//   useEffect(() => {
//     if (openSubmenu !== null) {
//       const key = `main-${openSubmenu.index}`;
//       if (subMenuRefs.current[key]) {
//         setSubMenuHeight((prev) => ({
//           ...prev,
//           [key]: subMenuRefs.current[key]?.scrollHeight || 0,
//         }));
//       }
//     }
//   }, [openSubmenu]);

//   const handleSubmenuToggle = (index: number) => {
//     setOpenSubmenu((prev) =>
//       prev?.index === index ? null : { type: "main", index }
//     );
//   };

//   const renderMenuItems = () => (
//     <ul className="flex flex-col gap-4">
//       {navItems.map((nav, index) => (
//         <li key={nav.name}>
//           {nav.subItems ? (
//             <button
//               onClick={() => handleSubmenuToggle(index)}
//               className={`menu-item group ${
//                 openSubmenu?.index === index
//                   ? "menu-item-active"
//                   : "menu-item-inactive"
//               }
//               ${
//                 !isExpanded && !isHovered
//                   ? "lg:justify-center"
//                   : "lg:justify-start"
//               }`}
//             >
//               <span
//                 className={`menu-item-icon-size ${
//                   openSubmenu?.index === index
//                     ? "menu-item-icon-active"
//                     : "menu-item-icon-inactive"
//                 }`}
//               >
//                 {nav.icon}
//               </span>
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <span className="menu-item-text">{nav.name}</span>
//               )}
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <ChevronDownIcon
//                   className={`ml-auto w-5 h-5 transition-transform duration-200 ${
//                     openSubmenu?.index === index
//                       ? "rotate-180 text-brand-500"
//                       : ""
//                   }`}
//                 />
//               )}
//             </button>
//           ) : (
//             nav.path && (
//               <Link
//                 to={nav.path}
//                 className={`menu-item group ${
//                   isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
//                 }`}
//               >
//                 <span
//                   className={`menu-item-icon-size ${
//                     isActive(nav.path)
//                       ? "menu-item-icon-active"
//                       : "menu-item-icon-inactive"
//                   }`}
//                 >
//                   {nav.icon}
//                 </span>
//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <span className="menu-item-text">{nav.name}</span>
//                 )}
//               </Link>
//             )
//           )}
//           {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
//             <div
//               ref={(el) => {
//                 subMenuRefs.current[`main-${index}`] = el;
//               }}
//               className="overflow-hidden transition-all duration-300"
//               style={{
//                 height:
//                   openSubmenu?.index === index
//                     ? `${subMenuHeight[`main-${index}`]}px`
//                     : "0px",
//               }}
//             >
//               <ul className="mt-2 space-y-1 ml-9">
//                 {nav.subItems.map((sub) => (
//                   <li key={sub.name}>
//                     <Link
//                       to={sub.path}
//                       className={`menu-dropdown-item ${
//                         isActive(sub.path)
//                           ? "menu-dropdown-item-active"
//                           : "menu-dropdown-item-inactive"
//                       }`}
//                     >
//                       {sub.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//     // <aside
//     //   className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
//     //     ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}
//     //     ${
//     //       isMobileOpen ? "translate-x-0" : "-translate-x-full"
//     //     } lg:translate-x-0`}
//     //   onMouseEnter={() => !isExpanded && setIsHovered(true)}
//     //   onMouseLeave={() => setIsHovered(false)}
//     // >
//     //   {/* TOP SECTION */}
//     //   <div
//     //     className={`py-8 flex ${
//     //       !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//     //     }`}
//     //   >
//     //     <Link to="">
//     //       {isExpanded || isHovered || isMobileOpen ? (
//     //         <>
//     //           <img
//     //             className="dark:hidden"
//     //             src="/images/logo/logo_nna.png"
//     //             alt="Logo"
//     //             width={150}
//     //             height={40}
//     //           />
//     //           <img
//     //             className="hidden dark:block"
//     //             src="/images/logo/logo-dark.svg"
//     //             alt="Logo"
//     //             width={150}
//     //             height={40}
//     //           />
//     //         </>
//     //       ) : (
//     //         <img
//     //           src="/images/logo/logo-icon.svg"
//     //           alt="Logo"
//     //           width={32}
//     //           height={32}
//     //         />
//     //       )}
//     //     </Link>
//     //   </div>

//     //   {/* BOTTOM SECTIO */}
//     //   <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//     //     <nav className="mb-6">
//     //       <div className="flex flex-col gap-4">
//     //         <div>
//     //           <h2
//     //             className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//     //               !isExpanded && !isHovered
//     //                 ? "lg:justify-center"
//     //                 : "justify-start"
//     //             }`}
//     //           >
//     //             {isExpanded || isHovered || isMobileOpen ? (
//     //               "Menu"
//     //             ) : (
//     //               <HorizontaLDots className="size-6" />
//     //             )}
//     //           </h2>
//     //           {renderMenuItems()}
//     //         </div>
//     //         {/* Settings Section */}
//     //         <div>
//     //           <h2
//     //             className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//     //               !isExpanded && !isHovered
//     //                 ? "lg:justify-center"
//     //                 : "justify-start"
//     //             }`}
//     //           >
//     //             {isExpanded || isHovered || isMobileOpen ? (
//     //               "Settings"
//     //             ) : (
//     //               <HorizontaLDots className="size-6" />
//     //             )}
//     //           </h2>
//     //           <ul className="flex flex-col gap-4">
//     //             <li>
//     //               <Link
//     //                 to="/settings"
//     //                 className={`menu-item group ${
//     //                   location.pathname === "/settings"
//     //                     ? "menu-item-active"
//     //                     : "menu-item-inactive"
//     //                 }`}
//     //               >
//     //                 <FaCog />
//     //                 {(isExpanded || isHovered || isMobileOpen) && (
//     //                   <span className="menu-item-text">Settings</span>
//     //                 )}
//     //               </Link>
//     //             </li>
//     //           </ul>
//     //         </div>
//     //       </div>
//     //     </nav>
//     //   </div>
//     // </aside>

//     <aside
//       className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
//     ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}
//     ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
//       onMouseEnter={() => !isExpanded && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* LOGO SECTION */}
//       <div
//         className={`py-8 flex ${
//           !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//         }`}
//       >
//         <Link to="">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <>
//               <img
//                 className="dark:hidden"
//                 src="/images/logo/logo_nna.png"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//               />
//               <img
//                 className="hidden dark:block"
//                 src="/images/logo/logo-dark.svg"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//               />
//             </>
//           ) : (
//             <img
//               src="/images/logo/logo-icon.svg"
//               alt="Logo"
//               width={32}
//               height={32}
//             />
//           )}
//         </Link>
//       </div>

//       {/* WRAP ALL MENU AND SETTINGS */}
//       <div className="flex flex-col justify-between flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
//         {/* MAIN MENU SECTION */}
//         <nav className="mb-6">
//           <div className="flex flex-col gap-4">
//             <div>
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "justify-start"
//                 }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "Menu"
//                 ) : (
//                   <HorizontaLDots className="size-6" />
//                 )}
//               </h2>
//               {renderMenuItems()}
//             </div>
//           </div>
//         </nav>

//         {/* SETTINGS SECTION */}
//         <nav className="mb-6">
//           <div>
//             <h2
//               className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                 !isExpanded && !isHovered
//                   ? "lg:justify-center"
//                   : "justify-start"
//               }`}
//             >
//               {isExpanded || isHovered || isMobileOpen ? (
//                 "Settings"
//               ) : (
//                 <HorizontaLDots className="size-6" />
//               )}
//             </h2>
//             <ul className="flex flex-col gap-4">
//               <li>
//                 <Link
//                   to="/settings"
//                   className={`menu-item group ${
//                     location.pathname === "/settings"
//                       ? "menu-item-active"
//                       : "menu-item-inactive"
//                   }`}
//                 >
//                   <FaCog />
//                   {(isExpanded || isHovered || isMobileOpen) && (
//                     <span className="menu-item-text">Settings</span>
//                   )}
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </nav>
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;
