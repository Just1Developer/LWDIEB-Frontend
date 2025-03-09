# How do create a new Widget: A Guide

### Read this before going to create new Widgets

---

## 0. Updates

### Updated Sections since the last Version: 2.2 (modified), 3.2 (modified), 3.2.1 (new), 3.6 (modified), 4.2 (modified)

---

## 1. Data Types

### 1.1 Widget Data Types

Each Widget, in general, has 2 Data Types:

1. **The Type of the Skeleton Arguments**: These Arguments are within the Skeleton Widget, they represent the data that is sent to the Backend server when Fetching Data. Additionally, only these options can be modified in the Edit Grid / Edit Widget.
2. **The Type of the Data Arguments**: This is the data type with all the stuff that is returned by the Fetch Function. This should match what is returned from Spring when fetching certain Data.

These types are in their respective sections in `/src/lib/argument-types.ts`. It is vital that the Skeleton Argument Types inherit from WidgetSkeletonArguments and the data types inherit from WidgetDataArguments. These restrictions are in place such that not any interface can be placed into the functions, and with the Skeleton Arguments, it is used for commonly shared data that every widget has, like the _level of detail_.\
The first step in creating your widget is creating your respective data types.

---

## 2. The Fetch Function

### 2.1 Fetching Data

All server actions for fetching data are located in `/src/features/actions/dashboard-api-data.ts`. There, a centralized Axios Instance with a cookie injector is used for handling the requests, the instance provides function for every established HTTP function, like GET, POST, etc.

There is an Example Function by the name of `getExampleWidgetData` below which shows how to utilize the Axios Instance. The Data Type of the function should use the specific, in Step 1 created types for the arguments and return type. All further information should be obtainable from the comments inside the example function.

### 2.2 Example Functions

Functions will look something like this:

```
export const getExampleWidgetData = async ({ args }: { args: ExampleArguments }): Promise<ExampleDataArguments> => {
  try {
    const response = await axiosInstance.get<ExampleDataArguments>('/api/exampleEndpoint', { params: args })
    // OR:
    const response = await axiosInstance.get<ExampleDataArguments>('/api/exampleEndpoint', { attr1: args.data1 })
    return response.data
  } catch (error) {
    // This should be of type ExampleDataArguments and contain the default data when communication failed.
    // This data should contain information in a way where it is displayed appropriately, rest can be empty strings or 0 if number
    return { data: 'Error fetching data' }
  }
}

export const postExampleData = async ({ args }: { args: ExampleArguments }): Promise<ExampleDataArguments> => {
  try {
    // Body is where the params are, there we can later pass (for example) the Dashboard.
    // The Return Types of this Function don't make that much sense for now, because the actual types don't exist yet, but don't worry about that
    // This is only to illustrate that there are other functions next to .get(), like .post(), or any other REST Function
    const response = await axiosInstance.post<ExampleDataArguments>('/api/exampleEndpoint', { newStuff: args.stuff })
    return response.data
  } catch (error) {
    // Appropriate Response should go here, as usual
    return { data: 'Error fetching data' }
  }
}
```

---

## 3. The Widget itself

### 3.1 Naming Conventions

For Files and Folders, we utilize kebab-case, as already present in the folder names.

### 3.2 The Display Widget

To create a new Widget, copy any existing widget and change it. An example Widget is provided in `/src/features/widget/example`. Each Widget should have its own folder. Inside this folder, there are two types of files:

1. widget.tsx
2. details*N*.tsx

**Important: Your Widgets Argument Props (The type that your Widget Function in `widget.tsx` receives) should extend `CommonViewWidgetProps` from `formless-widget.tsx`. This provides commons like the current size**

The Widget simply has one exported function and the shared interfaces used in the respective details*N*.tsx files. After copying, you should edit the function and interface names in `widget.tsx` to fit your current Widget, and change the Argument and Data types. This may temporarily cause errors with the FormlessWidget function, but not to worry. In every details.tsx file, there are 2 Functions: One to display when the data is there (receives fetch arguments and data arguments) and one to show when no data is present yet (receives only fetch arguments). The types need to be updated accordingly, and each details*N*.tsx, beginning from N=1, is responsible for rendering a single level of detail. Which level of detail is rendered for a specific widget is handled in the FormlessWidget logic.\
There are a few things that need to be changed in the central function for your Widget inside `widget.tsx`. By the way, this is the function you will call in the factory:

- **refreshRate**: This is the refresh rate for data in milliseconds. Adjust as needed
- **queryKey**: This is for built-in server-side caching in next, this needs to be set to the widget name. That different arguments receive different query keys is handled in FormlessWidget.
- **queryAction**: Here goes the Fetch Function (without brackets) created earlier. It is important that the types of this Widget match the Types of the Function, this is internally handled with generic types extended the respective argument data types.
- **arguments**: Simply passes the arguments that later end up in the level of detail and fetch function, leave unchanged.
- **levelsOfDetail**: This is a List ([]) of levels of detail, which each includes two components: The actual component and the loading state for the given level of detail. For each `detailsN.tsx` file, there should be one level of detail with both functions passed here. Again, the types need to match up.
- **currentSize**: Just pass the currentSize you get.

For Widgets that require multiple refresh rates, choose the lowest one for now, we will/may get to that later.

If you have no data to fetch, you can leave out refreshRate, queryKey and queryAction. As your TData, you should choose the default `WidgetDataArguments`.

**You have now successfully created your own Widget (at least in Viewport)**

### 3.2.1 The current size

You receive the current size in the View Widget and Edit Widget. One outlier worth mentioning is the loading state. This receives the regular arguments, and can receiver another attribute "commons", which is of type `CommonViewWidgetProps`, which contains the current size.\
The current size is used for text scaling, for the rest, simply using percentages will do. More on text sizes in Section 5.

You will also need to pass a size in the preview, more on that in Section 3.6.

### 3.3 The Edit Widget

This is pretty much the same procedure as in Widget: Copy a widget folder, rename it, change the data types. This section will only go over the _differences_.

1. There is no more loading state, since there is no more data to be loaded. Each level of detail should have the appropriate fields to edit data shown for that respective level of detail. Other parameters will be ignored when rendering it, as you have seen in your details when creating them.
2. You also do not receive data arguments, since there is no data. You will, however, receive a method that allows you to update the arguments when something changes. More on that in the >**_Inside Edit Widgets_**< Section. You also receive a method to set the dialog. This is so that the Dialog Owner is the EditGrid, not the Widget.
3. The level of detail switcher is created and functions automatically from within the edit grid. No need to add anything like that.
4. The **_return_** call is correctly set up, no need to change it. Since the last update, there is now a call to toEditableComponent(), this is intended.
5. **The relevant changes are in the list above**: There is a list of entries, each entry has the following:

   - component: The actual level of detail edit component
   - minimumSize: The minimum Size for this level of detail. It has height, width and the name that is shown in the level of detail switcher, so it should be describing. (For example: "2 Gleise", "3-4 Linien")

   If you set this up correctly, it will all fall into place.

6. There is a preview file for preview widgets. In the example file, two approaches are outlined. These widgets are used in the sidebar for adding new widgets, more details in section 3.6

Be aware that the Edit Widget Function returns a list of components with minimal sizes. This is required to have all the sizes later on the client side, this is all handled already.

### 3.4 Inside Edit Widgets

Inside Edit Widgets, there is stuff that we want to be able to change. All of these need to be in a useState and be dynamically updated. The default value can be taken from the arguments for consistency.\
When calling the provided `updateFn({ args })` function, the arguments are updated in the edit grid, until then, stuff like saving will not have the new values. Calling this function will also cause the component to reload, making the client lose focus in the component.
Evidently, the function should only be called when unfocusing an Element that can be typed into.

There is a provided `setDialog` Method. Here you can pass a ReactNode. Although it is not checked, it should be a Dialog. There is an Element `<ResponsiveDialog>...</ResponsiveDialog>`, there you can pass many arguments. There are comments explaining what each argument does, many are optional to use.

**Important**

Your EditWidgetProps in `widget.tsx` should extend `CommonEditWidgetProps`, which can be imported from the `formless-editdable-widget` file.

### 3.5 Calling Server Functions inside Widgets

Sometimes, it may be necessary to call a function inside a widget, if the options are dependent on a server response. For this, we can use queries like in `/src/features/dashboard/formless-widget.tsx`, but since appropriately calling it may be tricky, if you're struggling, just make a "pretend" mock object of the result to continue working, and we'll implement these touches together later on.

### 3.6 Default Widgets

In Edit Widgets, additionally to `widget.tsx` and `detailsN.tsx`, there is also `preview.tsx`. This should be a small version of the display widget (it is used in edit, so it still belongs in the /edit-dashboard/ directory) with
pre-made or hardcoded designs and arguments.\
In the file `/src/features/edit-dashboard/widget/example-widget/preview.ts`, two approaches are outlined. Either, you hardcode the entire thing, or you simply hardcode the arguments and call one of your levels of detail to render it. **The choice is yours**

**If you do not hardcode your preview, you will need to pass a current size. This can be any size, but should probably be a square. From there, just choose what looks right in the end.**

When you have created your Default Widget (naming conventions apply), you can add it to the list located in `/src/features/edit-dashboard/adder-sidebar/widget-previews.ts`. This is a list of triples, with the preview component and their respective widget type and name each. This type must be the same as in the factories, as that is where it is used. The name should not contain "Widget", that is clear. The name shows up (for example) as tooltip when browsing the widget previews, and should tell what kind of widget it is.

Your Widget should now show up in the Sidebar! When adding it, the regular widget of the lowest level of detail should be rendered in the smallest allowed size. After placement, you can change all properties, including LoD.

### 3.7 Default Arguments

You will also need to create Default Arguments in your edit `widget.tsx`. These values are filled in when adding a new widget of that type. Per Default, they can be 0, 0, or for example a location can be the location of the KIT. **The level of detail must be 0.**\
You will need this Default Arguments Object in the `widget-defaults.tsx` file in Section 4.2

### 3.8 Argument Validation

You will also need to create an Argument Validation function, that is, a function that takes in your Argument Type and returns a boolean that says if the arguments are valid or not. That means no empty fields, no invalid values, etc. In the example widget, which uses Weather Arguments, this would be validating if longitude and latitude are in valid bounds, which is what is being done here.\
This function should be placed in your `widget.tsx` inside the `.../edit-dashboard/...` folder. Where to register this function you will find out in Section 4.2

If you have no explicit validation function, you should still return true for your widget type. Typeless widgets are not valid, so the default return value is false.

### 3.9 Information: Adding Widgets in the UI

In the UI, you click on the widget you want to add. This is then attached to your cursor and does not snap to grid. Then, when pressing the left mouse button, it should snap to grid and show the "ghost". When you let go, it should be placed, if possible, or disappear. If the sidebar is opened again while holding a widget, it disappears.\
Let me know what you think of this approach!

### 3.10 Using Location Pickers

You can use a `<LocationPicker/>` in your edit widget. This will implement a circular button with a map icon. When opened, a map dialog pops up. You should essentially pass 4 options to this element:

1. A function that takes in latitude and longitude (Type LocationUpdateProps) and returns nothing. This function will be executed with the new latitude and longitude when the location has been updated (Confirm pressed)
2. The longitude the map should start in. Optional, but recommended if your widget saves the location. Default is KIT Campus
3. The latitude the map should start in. Optional, but recommended if your widget saves the location. Default is KIT Campus
4. The setDialog function you have provided in the Props. This internally creates the dialog window when the icon is pressed

There is also a MapView if you with to display the location you chose. This is not interactive.\
You may need to reign in the size of the MapView, it is used exemplary in the `/feature/widget/example/edit/details1.tsx`

---

## 4. Factory Integration

### 4.1 Factories

The factories in `/src/features/shared/widget-factory.ts` are responsible for converting loaded Widgets from the received Dashboard to Widgets that can be rendered by the grids. For this, they need to know the Widgets.

There are three factories, one for the regular grid, one for the edit grid, and one for default widgets. They work by having a JSON Map-like object map each type (`string`) to its respective widget function, or a default, if no widget function exists for the given type. In the factory for regular widgets, it is recommended to use the \<Widget/> writing and not the function-format for built-in cache optimizations. In the Edit Widget Factory, this is not possible.

The Factory converts the type defined in the SkeletonWidget from the Skeleton Dashboard, so it needs to match up

### 4.2 Adding your widgets

There are five files located in `/src/configuration/widget-register/`, these are for the five parts where you need to register your widget + type. It should be fairly obvious how to insert them, as always the example widget is already added, so you simply need to change it to the ones you have created. The widget type should match `[a-z]+`, and formatted like the example widget.\
**Pay attention to your imports, especially `.../view/...` vs `.../edit/...`**

The five widget files are:

| file                    | purpose                                                                                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `widget-defaults.tsx`   | Here go the Default Widgets. This is a special one because here you need to pass the same function as in `widget-edits.tsx`, but also the default arguments.                                      |
| `widget-edits.tsx`      | Here goes the Edit Widget function from the `.../features/widget/.../edit/widget.tsx` you have created.                                                                                           |
| `widget-previews.tsx`   | This is the preview. Here, you need three elements again: The component, written in <.../>, and the widget type and name. The type must match what you enter in all the factories.                |
| `widget-validators.tsx` | This is a special one. This contains a switch statement, which calls the appropriate validation function for arguments of this widget type.\ You will need to add your own case-return statement. |
| `widget-views.tsx`      | Here goes the Regular Widget from the `.../features/widget/.../view/widget.tsx` you have created. Use the formatting of <.../> like the example widget does.                                      |

### 4.3 Special Mention: The Default Factory

The default factory (`constructDefaultEditWidget()`) is used in the edit grid. It only received the type as string, and returns something similar to the edit widget factory.
The key difference is that many properties (5) are empty and are calculated later in the edit grid. Otherwise, when editing, treat it the same as the edit factory for your entries.

## 5. Text and Feature Sizes

There is no feature to appropriately and dynamically handle text sizes right now. If you do, see what resizing does to your Widget(s).\
Also, feel free to implement it, but try to avoid style={{ ... }} if possible.

## 6. Widget Signatures

**For this, the widget must be converted to a string using for example JSON.stringify(). This string must not contain any whitespace, line breaks, etc.**

```
public static long createChecksum(String data) {
  long first = generateHash(data.substring(0, data.length() / 3));
  long second = generateHash(data.substring(data.length() / 4, (int) Math.round(data.length() / 1.5)));
  long third = generateHash(data.substring(data.length() / 2, data.length() - data.length() / 4));
  long fourth = generateHash(data.substring(data.length() / 3, data.length() - data.length() / 5 - 1));
  long signature = first * second * third * fourth + third * fourth;
  return signature == 0 ? 1 : signature;
}

public static long generateHash(String data) {
  long product = 1;
  for (char c : data.toCharArray()) {
    long num = c << 2;
    product *= ((num + (num << 2)) >> 1);
    product += ((num + (num << 7)) >> 2);
  }
  return product;
}
```

# Enjoy your Widgets!
