import { writable } from 'svelte/store';
import type { Menu, SubMenu } from '$lib/model/MenuModel';
import { browser } from '$app/environment';

export const menuStore = writable<Menu[]>([]);

// const activeMenu = writable(getActiveMenu('activeMenu'));

// const currentMenu = writable(getCurrentMenu('currentMenu'));

// const initMenu : Menu = {
//     title : '',
//     link : '/',
// };


// activeMenu.subscribe((val) => {
// 	if (browser) {
// 		localStorage.setItem('activeMenu', JSON.stringify(val));
// 	}
// });

// currentMenu.subscribe((val) => {
// 	if (browser) {
// 		localStorage.setItem('currentMenu', JSON.stringify(val));
// 	}
// });


// function getActiveMenu(key:string) : string{
//     if(!browser) return '/';
//     return localStorage.getItem(key) || '/';
// }


// function getCurrentMenu(key:string) : Menu {
//     if(!browser) return initMenu;
//     return JSON.parse(localStorage.getItem(key) || '{}');
// }



// /// 활성 메뉴 업데이트
// function updateActiveMenu (route: string) {
//     activeMenu.set(route);
// }

// /// 활성 메뉴 초기화
// function resetActiveMenu (){
//     activeMenu.set('/');
// }

// /// 현재 선택된 1depth 메뉴
// function updateCurrentMenu (menu : Menu) {
//     currentMenu.set(menu);
// }

// /// 메뉴 선택 취소
// function resetCurrentMenu () {
//     currentMenu.set(initMenu);
// }

// const menuStore = {
    // activeMenu,
    // currentMenu,
    // updateActiveMenu, 
    // resetActiveMenu, 
    // updateCurrentMenu, 
    // resetCurrentMenu
// };

// export default menuStore;