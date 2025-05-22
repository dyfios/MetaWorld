/// @file loadingindicator.js
/// Module for a loading indicator.

class LoadingIndicator {
    constructor() {
        this.indicatorCanvas = CanvasEntity.Create(null, Vector3.zero, Quaternion.identity, Vector3.one, false);
        this.indicatorCanvas.MakeScreenCanvas(false);
        this.indicatorObject = TextEntity.Create(this.indicatorCanvas, "Loading...", 18, Vector2.zero, Vector2.one);
        this.indicatorCanvas.SetVisibility(true);
        this.indicatorCanvas.SetInteractionState(InteractionState.Static);
        this.indicatorObject.SetVisibility(true);
        this.indicatorCanvas.SetInteractionState(InteractionState.Static);
        Context.DefineContext("LoadingIndicatorContext", this);
        
        Time.SetInterval(`
            context = Context.GetContext("LoadingIndicatorContext");
            
            state = World.GetWorldLoadState();
            if (state == "loadingworld") {
                context.indicatorCanvas.SetVisibility(true);
                context.indicatorCanvas.SetInteractionState(InteractionState.Static);
            }
            else {
                context.indicatorCanvas.SetVisibility(false);
                context.indicatorCanvas.SetInteractionState(InteractionState.Hidden);
            }
        `, 1);
    }
}