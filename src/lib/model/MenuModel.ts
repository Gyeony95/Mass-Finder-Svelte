interface Menu {
    title: string;
    link: string;
    submenus?: SubMenu[];
}

interface SubMenu {
    title: string;
    link: string;
    submenus?: SubMenu[];
}