function MW_UI_EditToolbar_SetUpToolbar() {
    this.toolbar = new MainToolbar();
    WorldStorage.SetItem("TERRAIN-EDIT-LAYER", "-1");
    WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 1);
    WorldStorage.SetItem("TERRAIN-BRUSH-MAX-HEIGHT", 192);
}