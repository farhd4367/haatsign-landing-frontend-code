import React, { useState, useEffect } from "react";
// Use native <img> for reliable load events from remote sources
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/router";
import {
  Navbar,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLandingSettings,
  enableHeader,
} from "@/redux/landingSettingSlice";
import { motion } from "framer-motion";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const router = useRouter();

  const landingSettingsData = useSelector(
    (state) => state.landingSettings.landingSettingsData
  );

  const headerEnabledData = useSelector(
    (state) => state.landingSettings.headerEnabledData || []
  );

  useEffect(() => {
    const loadSettings = async () => {
      await dispatch(fetchLandingSettings());
      await dispatch(enableHeader());
    };
    loadSettings();
  }, [dispatch]);

  const toggle = () => {
    setIsOpen(!isOpen);
    setIsOverlayOpen(!isOverlayOpen);
  };

  const settings = landingSettingsData?.[0];

  useEffect(() => {
    // Reset logo loaded state when source changes so skeleton shows again
    setLogoLoaded(false);
  }, [settings?.logo_color]);

  const isActive = (pathOrPaths) => {
    const currentPath = router.asPath;
    const paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
    return paths.some((path) => currentPath.startsWith(path));
  };

  // List of statically handled paths
  const STATIC_HEADER_PATHS = [
    "/about-us",
    "/why-haatsign",
    "/general-manager-speech",
    "/team-members",
    "/partners",
    "/customers",
    "/blogs",
    "/news",
    "/pricing",
    "/contact-us",
  ];

  return (
    <>
      {/* Custom dropdown position override */}
      <style>{`
        .dropdown-menu[data-bs-popper] {
          top: 95% !important;
          left: -50%;
        }
      `}</style>
      <div
        className={`overlay ${isOverlayOpen ? "open" : ""}`}
        onClick={toggle}
      ></div>
      <motion.div
        className="navbar-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="container">
          <Navbar light expand="lg" className="justify-content-between">
            <Link href="/" passHref legacyBehavior>
              <a className="navbar-brand">
                {settings?.logo_color ? (
                  <>
                    {!logoLoaded && <div></div>}

                    <img
                      src={settings.logo_color}
                      alt="Logo"
                      width={100}
                      height={100}
                      style={{ display: logoLoaded ? "block" : "none" }}
                      onLoad={() => setLogoLoaded(true)}
                      onError={() => setLogoLoaded(true)}
                    />
                  </>
                ) : (
                  <div></div>
                )}
              </a>
            </Link>
            <NavbarToggler onClick={toggle} />

            <Collapse isOpen={isOpen} navbar>
              <Nav className="ml-auto" navbar>
                {settings?.show_header_about_us === 1 && (
                  <Dropdown
                    nav
                    inNavbar
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                    isOpen={isDropdownOpen}
                    toggle={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <DropdownToggle
                      nav
                      caret
                      className={`top-dropdown-toggle ${
                        isActive([
                          "/about-us",
                          "/why-haatsign",
                          "/general-manager-speech",
                          "/team-members",
                        ])
                          ? "header-active-link"
                          : ""
                      }`}
                      onClick={(e) => e.preventDefault()}
                    >
                      {t("about")} ⛛
                    </DropdownToggle>

                    <DropdownMenu className="top-dropdown-menu">
                      {["/about-us", "/why-haatsign", "/general-manager-speech"]
                        .map((url) =>
                          headerEnabledData.find(
                            (page) =>
                              page.page_url === url && page.is_header === 1
                          )
                        )
                        .filter(Boolean)
                        .map((page) => (
                          <DropdownItem
                            key={page.id}
                            tag={Link}
                            href={page.page_url}
                          >
                            {router.locale === "ar"
                              ? page.page_title_ar
                              : page.page_title_en}
                          </DropdownItem>
                        ))}

                      {/* Static team-members link (always shown) */}
                      <DropdownItem tag={Link} href="/team-members">
                        {t("Team Members")}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}

                {settings?.show_header_partner === 1 && (
                  <NavItem>
                    <Link href="/partners" passHref legacyBehavior>
                      <NavLink
                        className={`top-nav-link ${
                          isActive("/partners") ? "header-active-link" : ""
                        }`}
                      >
                        {t("partners")}
                      </NavLink>
                    </Link>
                  </NavItem>
                )}

                {settings?.show_header_customer === 1 && (
                  <NavItem>
                    <Link href="/customers" passHref legacyBehavior>
                      <NavLink
                        className={`top-nav-link ${
                          isActive("/customers") ? "header-active-link" : ""
                        }`}
                      >
                        {t("Customers")}
                      </NavLink>
                    </Link>
                  </NavItem>
                )}

                {settings?.show_header_blog === 1 && (
                  <NavItem>
                    <Link href="/blogs" passHref legacyBehavior>
                      <NavLink
                        className={`top-nav-link ${
                          isActive("/blogs") ? "header-active-link" : ""
                        }`}
                      >
                        {t("blogs")}
                      </NavLink>
                    </Link>
                  </NavItem>
                )}

                {settings?.show_header_news === 1 && (
                  <NavItem>
                    <Link href="/news" passHref legacyBehavior>
                      <NavLink
                        className={`top-nav-link ${
                          isActive("/news") ? "header-active-link" : ""
                        }`}
                      >
                        {t("news")}
                      </NavLink>
                    </Link>
                  </NavItem>
                )}

                {settings?.show_header_pricing === 1 && (
                  <NavItem>
                    <Link href="/pricing" passHref legacyBehavior>
                      <NavLink
                        className={`top-nav-link ${
                          isActive("/pricing") ? "header-active-link" : ""
                        }`}
                      >
                        {t("Pricing")}
                      </NavLink>
                    </Link>
                  </NavItem>
                )}

                {/* Dynamically render any additional pages */}
                {headerEnabledData
                  ?.filter(
                    (page) =>
                      page.is_header === 1 &&
                      page.status === "active" &&
                      !STATIC_HEADER_PATHS.includes(page.page_url)
                  )
                  .map((page) => (
                    <NavItem key={page.id}>
                      <Link href={page.page_url} passHref legacyBehavior>
                        <NavLink
                          className={`top-nav-link ${
                            isActive(page.page_url) ? "header-active-link" : ""
                          }`}
                        >
                          {router.locale === "ar"
                            ? page.page_title_ar
                            : page.page_title_en}
                        </NavLink>
                      </Link>
                    </NavItem>
                  ))}

                {settings?.show_header_help_center === 1 && (
                  <NavItem>
                    <Link href="/contact-us" passHref legacyBehavior>
                      <NavLink
                        className={`top-nav-link ${
                          isActive("/contact-us") ? "header-active-link" : ""
                        }`}
                      >
                        {t("helpCenter")}
                      </NavLink>
                    </Link>
                  </NavItem>
                )}
              </Nav>
            </Collapse>
          </Navbar>
        </div>
      </motion.div>
    </>
  );
};

export default Header;
