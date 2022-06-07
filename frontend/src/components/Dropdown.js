import React from "react";
import { createPopper } from "@popperjs/core";

//This component was extracted from: 
//https://www.creative-tim.com/learning-lab/tailwind-starter-kit/documentation/react/dropdown

export const Dropdown = ({projects, projectHandler}) => {
    // dropdown props
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef = React.createRef();
    const popoverDropdownRef = React.createRef();
    const openDropdownPopover = () => {
        createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: "bottom-start"
        });
        setDropdownPopoverShow(true);
    };
    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };
    // bg colors
    let bgColor;
    let color = 'white'
    color === "white"
        ? (bgColor = "bg-slate-700")
        : (bgColor = "bg-" + color + "-500");

    //projects array
    var projectsList = projects.map((project, index) => (
        <a
            key={project.id}
            data-pos={index}
            data-project_id={project.id}

            href={`#${project.id}`}
            className={
                "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent " +
                    (color === "white" ? " text-slate-700" : "text-white")
            }
            onClick={e => projectHandler(e)}
        >
            {project.name}
        </a>
    ))

    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full sm:w-6/12 md:w-4/12 px-4">
                    <div className="relative inline-flex align-middle w-full">
                        <button
                            className={
                                "text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 " +
                                    bgColor
                            }
                            type="button"
                            ref={btnDropdownRef}
                            onClick={() => {
                                dropdownPopoverShow
                                    ? closeDropdownPopover()
                                    : openDropdownPopover();
                            }}
                        >
                            Projects List 
                        </button>
                        <div
                            ref={popoverDropdownRef}
                            className={
                                (dropdownPopoverShow ? "block " : "hidden ") +
                                    (color === "white" ? "bg-white " : bgColor + " ") +
                                    "text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1"
                            }
                            style={{ minWidth: "12rem" }}
                        >
                            {projectsList} 
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
