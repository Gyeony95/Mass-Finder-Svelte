export interface Menu {
    title: string;
    link: string;
    submenus?: SubMenu[];
}

export interface SubMenu {
    title: string;
    link: string;
    submenus?: SubMenu[];
}